# AWS Infrastructure Configuration for VR4Deaf Platform

This document outlines the AWS services configuration for the VR4Deaf Business Magician platform, specifically for ASL video processing and delivery.

## Services Used

### 1. Amazon S3 (Simple Storage Service)
**Purpose**: Store raw and processed ASL video content

**Buckets**:
- `vr4deaf-sign-language-videos-raw` - Raw uploaded videos
- `vr4deaf-sign-language-videos-processed` - Processed/transcoded videos
- `vr4deaf-sign-language-videos-thumbnails` - Video thumbnails

**Configuration**:
```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Sid": "PublicReadGetObject",
      "Effect": "Allow",
      "Principal": "*",
      "Action": "s3:GetObject",
      "Resource": "arn:aws:s3:::vr4deaf-sign-language-videos-processed/*"
    }
  ]
}
```

**Lifecycle Rules**:
- Raw videos: Delete after 30 days (after processing)
- Processed videos: Standard storage
- Thumbnails: Transition to Infrequent Access after 90 days

### 2. AWS MediaConvert
**Purpose**: Transcode ASL videos to multiple formats and resolutions

**Output Formats**:
1. **1080p (Full HD)** - For desktop viewing
   - Video: H.264, 5 Mbps
   - Audio: AAC, 128 kbps
   - Container: MP4

2. **720p (HD)** - For tablet viewing
   - Video: H.264, 3 Mbps
   - Audio: AAC, 128 kbps
   - Container: MP4

3. **480p (SD)** - For mobile viewing
   - Video: H.264, 1.5 Mbps
   - Audio: AAC, 96 kbps
   - Container: MP4

4. **HLS Adaptive Streaming**
   - Multiple quality levels
   - Automatic quality switching

**Job Template** (JSON):
```json
{
  "Name": "VR4Deaf-ASL-Video-Processing",
  "Description": "Process ASL videos for VR4Deaf platform",
  "Settings": {
    "Inputs": [
      {
        "FileInput": "s3://vr4deaf-sign-language-videos-raw/input-video.mp4",
        "VideoSelector": {},
        "AudioSelectors": {
          "Audio Selector 1": {
            "DefaultSelection": "DEFAULT"
          }
        }
      }
    ],
    "OutputGroups": [
      {
        "Name": "File Group - 1080p",
        "Outputs": [
          {
            "ContainerSettings": {
              "Container": "MP4"
            },
            "VideoDescription": {
              "CodecSettings": {
                "Codec": "H_264",
                "H264Settings": {
                  "Bitrate": 5000000,
                  "MaxBitrate": 5000000,
                  "RateControlMode": "CBR"
                }
              },
              "Width": 1920,
              "Height": 1080
            },
            "AudioDescriptions": [
              {
                "CodecSettings": {
                  "Codec": "AAC",
                  "AacSettings": {
                    "Bitrate": 128000
                  }
                }
              }
            ]
          }
        ],
        "OutputGroupSettings": {
          "Type": "FILE_GROUP_SETTINGS",
          "FileGroupSettings": {
            "Destination": "s3://vr4deaf-sign-language-videos-processed/1080p/"
          }
        }
      }
    ]
  }
}
```

### 3. AWS Lambda
**Purpose**: Trigger video processing workflows

**Functions**:

#### ProcessASLVideoUpload
Triggered when new video is uploaded to S3 raw bucket

```javascript
// lambda/processASLVideoUpload.js
const AWS = require('aws-sdk');
const mediaConvert = new AWS.MediaConvert({
  endpoint: process.env.MEDIACONVERT_ENDPOINT
});

exports.handler = async (event) => {
  const record = event.Records[0];
  const bucket = record.s3.bucket.name;
  const key = decodeURIComponent(record.s3.object.key.replace(/\+/g, ' '));
  
  const jobParams = {
    Queue: process.env.MEDIACONVERT_QUEUE_ARN,
    Role: process.env.MEDIACONVERT_ROLE_ARN,
    Settings: {
      Inputs: [{
        FileInput: `s3://${bucket}/${key}`,
      }],
      OutputGroups: [
        // ... output configurations
      ]
    },
    UserMetadata: {
      videoId: key.split('/').pop().split('.')[0],
      uploadedBy: record.userIdentity?.principalId || 'unknown'
    }
  };
  
  try {
    const result = await mediaConvert.createJob(jobParams).promise();
    console.log('MediaConvert job created:', result.Job.Id);
    return {
      statusCode: 200,
      body: JSON.stringify({ jobId: result.Job.Id })
    };
  } catch (error) {
    console.error('Error creating MediaConvert job:', error);
    throw error;
  }
};
```

**Environment Variables**:
```
MEDIACONVERT_ENDPOINT=https://xxx.mediaconvert.us-east-1.amazonaws.com
MEDIACONVERT_QUEUE_ARN=arn:aws:mediaconvert:us-east-1:xxx:queues/Default
MEDIACONVERT_ROLE_ARN=arn:aws:iam::xxx:role/MediaConvertRole
```

#### GenerateVideoThumbnail
Generate thumbnail images for video previews

```javascript
// lambda/generateVideoThumbnail.js
const AWS = require('aws-sdk');
const ffmpeg = require('fluent-ffmpeg');
const s3 = new AWS.S3();

exports.handler = async (event) => {
  const record = event.Records[0];
  const bucket = record.s3.bucket.name;
  const key = decodeURIComponent(record.s3.object.key.replace(/\+/g, ' '));
  
  // Download video from S3
  const videoStream = s3.getObject({
    Bucket: bucket,
    Key: key
  }).createReadStream();
  
  // Generate thumbnail at 3 seconds
  return new Promise((resolve, reject) => {
    ffmpeg(videoStream)
      .screenshots({
        timestamps: ['3'],
        filename: 'thumbnail.jpg',
        size: '640x360'
      })
      .on('end', async () => {
        // Upload thumbnail to S3
        const thumbnailKey = key.replace('/processed/', '/thumbnails/').replace('.mp4', '.jpg');
        await s3.putObject({
          Bucket: 'vr4deaf-sign-language-videos-thumbnails',
          Key: thumbnailKey,
          Body: thumbnailBuffer,
          ContentType: 'image/jpeg'
        }).promise();
        
        resolve({ statusCode: 200 });
      })
      .on('error', reject);
  });
};
```

### 4. Amazon CloudFront (CDN)
**Purpose**: Global content delivery for fast video streaming

**Distribution Configuration**:
```json
{
  "DistributionConfig": {
    "CallerReference": "vr4deaf-asl-videos",
    "Comment": "CDN for VR4Deaf ASL videos",
    "Enabled": true,
    "Origins": [
      {
        "Id": "S3-vr4deaf-videos",
        "DomainName": "vr4deaf-sign-language-videos-processed.s3.amazonaws.com",
        "S3OriginConfig": {
          "OriginAccessIdentity": "origin-access-identity/cloudfront/EXAMPLE"
        }
      }
    ],
    "DefaultCacheBehavior": {
      "TargetOriginId": "S3-vr4deaf-videos",
      "ViewerProtocolPolicy": "redirect-to-https",
      "AllowedMethods": ["GET", "HEAD", "OPTIONS"],
      "CachedMethods": ["GET", "HEAD"],
      "Compress": true,
      "MinTTL": 0,
      "DefaultTTL": 86400,
      "MaxTTL": 31536000
    },
    "PriceClass": "PriceClass_100",
    "ViewerCertificate": {
      "CloudFrontDefaultCertificate": true
    }
  }
}
```

**Custom Domain**: `videos.vr4deaf.org`

### 5. AWS IAM Roles and Policies

#### MediaConvert Role
```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Effect": "Allow",
      "Action": [
        "s3:GetObject",
        "s3:PutObject"
      ],
      "Resource": [
        "arn:aws:s3:::vr4deaf-sign-language-videos-raw/*",
        "arn:aws:s3:::vr4deaf-sign-language-videos-processed/*"
      ]
    }
  ]
}
```

#### Lambda Execution Role
```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Effect": "Allow",
      "Action": [
        "s3:GetObject",
        "s3:PutObject"
      ],
      "Resource": "arn:aws:s3:::vr4deaf-sign-language-videos-*/*"
    },
    {
      "Effect": "Allow",
      "Action": [
        "mediaconvert:CreateJob",
        "mediaconvert:GetJob"
      ],
      "Resource": "*"
    },
    {
      "Effect": "Allow",
      "Action": [
        "logs:CreateLogGroup",
        "logs:CreateLogStream",
        "logs:PutLogEvents"
      ],
      "Resource": "arn:aws:logs:*:*:*"
    }
  ]
}
```

## Cost Optimization

### Free Tier Usage (First 12 months)
- S3: 5 GB storage
- Lambda: 1 million requests/month
- CloudFront: 50 GB data transfer

### Estimated Monthly Costs (After Free Tier)
- **S3 Storage**: ~$0.023/GB (Standard)
- **MediaConvert**: ~$0.015/minute of video processed
- **Lambda**: ~$0.20/million requests
- **CloudFront**: ~$0.085/GB for first 10 TB

**Example**: 
- 100 videos/month @ 5 minutes each
- Processing: 500 minutes × $0.015 = $7.50
- Storage: 50 GB × $0.023 = $1.15
- CloudFront: 100 GB × $0.085 = $8.50
- **Total**: ~$17/month

## Deployment Instructions

### 1. Create S3 Buckets
```bash
aws s3 mb s3://vr4deaf-sign-language-videos-raw --region us-east-1
aws s3 mb s3://vr4deaf-sign-language-videos-processed --region us-east-1
aws s3 mb s3://vr4deaf-sign-language-videos-thumbnails --region us-east-1
```

### 2. Deploy Lambda Functions
```bash
cd lambda
zip -r processASLVideoUpload.zip processASLVideoUpload.js node_modules
aws lambda create-function \
  --function-name processASLVideoUpload \
  --runtime nodejs20.x \
  --handler processASLVideoUpload.handler \
  --role arn:aws:iam::xxx:role/LambdaExecutionRole \
  --zip-file fileb://processASLVideoUpload.zip
```

### 3. Configure S3 Event Notifications
```bash
aws s3api put-bucket-notification-configuration \
  --bucket vr4deaf-sign-language-videos-raw \
  --notification-configuration file://s3-event-config.json
```

### 4. Create CloudFront Distribution
```bash
aws cloudfront create-distribution \
  --distribution-config file://cloudfront-config.json
```

## Monitoring and Alerts

### CloudWatch Metrics
- S3 bucket size
- MediaConvert job success/failure rates
- Lambda invocation count and errors
- CloudFront cache hit ratio

### Alarms
- High processing failure rate (>5%)
- Unexpected storage growth
- High CloudFront costs

## Security Best Practices

1. **Encryption at Rest**: Enable S3 bucket encryption
2. **Encryption in Transit**: HTTPS only via CloudFront
3. **Access Control**: IAM roles with least privilege
4. **Signed URLs**: For private content access
5. **CloudFront OAI**: Restrict direct S3 access

## Integration with Application

```typescript
// server/services/aws/videoProcessing.ts
import AWS from 'aws-sdk';

const s3 = new AWS.S3({
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  region: process.env.AWS_REGION
});

export async function uploadASLVideo(file: Buffer, filename: string) {
  const key = `${Date.now()}-${filename}`;
  
  await s3.putObject({
    Bucket: process.env.AWS_S3_BUCKET_RAW!,
    Key: key,
    Body: file,
    ContentType: 'video/mp4',
    Metadata: {
      uploadedAt: new Date().toISOString(),
      platform: 'vr4deaf-business-magician'
    }
  }).promise();
  
  return {
    key,
    status: 'processing',
    message: 'Video uploaded and processing started'
  };
}

export async function getProcessedVideoUrl(videoId: string): Promise<string> {
  const cloudFrontDomain = process.env.CLOUDFRONT_DOMAIN;
  return `https://${cloudFrontDomain}/processed/${videoId}.mp4`;
}
```

## Support

For AWS configuration issues:
- **Email**: tech@vr4deaf.org
- **AWS Support**: [AWS Support Center](https://console.aws.amazon.com/support/)
