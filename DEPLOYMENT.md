# Deployment Guide - VR4Deaf Business Magician Platform

This guide provides step-by-step instructions for deploying the VR4Deaf Business Magician platform across multiple cloud providers.

## Architecture Overview

The platform uses a multi-cloud architecture:

- **Vercel**: Frontend hosting and serverless functions
- **AWS**: Video processing (S3, MediaConvert, Lambda, CloudFront)
- **Google Cloud/Firebase**: Database, storage, and real-time features
- **PostgreSQL**: Primary database (can be hosted on any provider)

## Prerequisites

Before deployment, ensure you have:

1. **Accounts**:
   - GitHub account
   - Vercel account
   - AWS account
   - Google Cloud/Firebase account

2. **Tools Installed**:
   - Node.js 20+
   - Git
   - AWS CLI
   - Firebase CLI (`npm install -g firebase-tools`)
   - Vercel CLI (`npm install -g vercel`)

3. **API Keys**:
   - VR4Deaf API key
   - DeafAuth credentials
   - PinkSync API key
   - FibonRose API key
   - OpenAI/Anthropic API keys (optional)

## Step 1: Repository Setup

### 1.1 Clone Repository

```bash
git clone https://github.com/vr4deaf/Business_Magician_-Express.git
cd Business_Magician_-Express
```

### 1.2 Install Dependencies

```bash
npm install
```

### 1.3 Environment Variables

Create a `.env` file based on `.env.example`:

```bash
cp .env.example .env
```

Edit `.env` and fill in all required values.

## Step 2: Firebase Setup

### 2.1 Create Firebase Project

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Click "Add project"
3. Name: `vr4deaf-business-magician`
4. Enable Google Analytics (optional)

### 2.2 Enable Firebase Services

```bash
# Login to Firebase
firebase login

# Initialize Firebase in project
firebase init

# Select these services:
# - Firestore
# - Storage
# - Functions
# - Hosting
```

Select options:
- Firestore rules file: `firestore.rules`
- Firestore indexes file: `firestore.indexes.json`
- Storage rules file: `storage.rules`
- Functions language: TypeScript
- Hosting public directory: `dist/client`

### 2.3 Get Firebase Configuration

1. In Firebase Console, go to Project Settings
2. Under "Your apps", click "Web app"
3. Copy the config object
4. Add values to `.env`:

```env
FIREBASE_PROJECT_ID=vr4deaf-business-magician
FIREBASE_API_KEY=your-api-key
GOOGLE_CLOUD_PROJECT_ID=vr4deaf-business-magician
```

### 2.4 Deploy Firebase Rules and Indexes

```bash
firebase deploy --only firestore:rules
firebase deploy --only firestore:indexes
firebase deploy --only storage
```

## Step 3: AWS Setup

### 3.1 Configure AWS CLI

```bash
aws configure
# Enter your AWS Access Key ID
# Enter your AWS Secret Access Key
# Default region: us-east-1
# Default output format: json
```

### 3.2 Create S3 Buckets

```bash
# Raw video uploads
aws s3 mb s3://vr4deaf-sign-language-videos-raw --region us-east-1

# Processed videos
aws s3 mb s3://vr4deaf-sign-language-videos-processed --region us-east-1

# Video thumbnails
aws s3 mb s3://vr4deaf-sign-language-videos-thumbnails --region us-east-1
```

### 3.3 Configure S3 CORS

Create `s3-cors.json`:

```json
{
  "CORSRules": [
    {
      "AllowedHeaders": ["*"],
      "AllowedMethods": ["GET", "PUT", "POST"],
      "AllowedOrigins": ["https://vr4deaf.org", "https://*.vercel.app"],
      "ExposeHeaders": ["ETag"],
      "MaxAgeSeconds": 3000
    }
  ]
}
```

Apply CORS:

```bash
aws s3api put-bucket-cors \
  --bucket vr4deaf-sign-language-videos-raw \
  --cors-configuration file://s3-cors.json
```

### 3.4 Create IAM Roles

See `AWS-CONFIGURATION.md` for detailed IAM role configurations.

### 3.5 Deploy Lambda Functions

```bash
# Package Lambda function
cd lambda
npm install
zip -r processASLVideoUpload.zip .

# Deploy
aws lambda create-function \
  --function-name vr4deaf-process-video \
  --runtime nodejs20.x \
  --handler processASLVideoUpload.handler \
  --role arn:aws:iam::YOUR_ACCOUNT:role/LambdaExecutionRole \
  --zip-file fileb://processASLVideoUpload.zip \
  --environment Variables="{MEDIACONVERT_ENDPOINT=https://xxx.mediaconvert.us-east-1.amazonaws.com}"
```

### 3.6 Configure S3 Event Trigger

```bash
aws s3api put-bucket-notification-configuration \
  --bucket vr4deaf-sign-language-videos-raw \
  --notification-configuration file://s3-notification.json
```

### 3.7 Create CloudFront Distribution

```bash
aws cloudfront create-distribution \
  --distribution-config file://cloudfront-config.json
```

Note the CloudFront domain (e.g., `d111111abcdef8.cloudfront.net`).

### 3.8 Update Environment Variables

Add AWS values to `.env`:

```env
AWS_ACCESS_KEY_ID=your-access-key
AWS_SECRET_ACCESS_KEY=your-secret-key
AWS_REGION=us-east-1
AWS_S3_BUCKET=vr4deaf-sign-language-videos-raw
CLOUDFRONT_DOMAIN=d111111abcdef8.cloudfront.net
```

## Step 4: Database Setup

### 4.1 Choose Database Provider

Options:
- **Neon** (recommended for serverless)
- **Supabase**
- **Railway**
- **Self-hosted PostgreSQL**

### 4.2 Create Database

Example using Neon:

1. Go to [neon.tech](https://neon.tech)
2. Create new project: `vr4deaf-business-magician`
3. Copy connection string

### 4.3 Configure Database URL

Add to `.env`:

```env
DATABASE_URL=postgresql://user:pass@host.neon.tech/dbname?sslmode=require
```

### 4.4 Run Migrations

```bash
npm run db:push
```

## Step 5: Vercel Deployment

### 5.1 Install Vercel CLI

```bash
npm install -g vercel
```

### 5.2 Login to Vercel

```bash
vercel login
```

### 5.3 Link Project

```bash
vercel link
```

Follow prompts:
- Set up and deploy: Yes
- Scope: Your account/team
- Link to existing project: No
- Project name: `vr4deaf-business-magician`

### 5.4 Configure Environment Variables

```bash
# Add all environment variables from .env
vercel env add DATABASE_URL
vercel env add VR4DEAF_API_KEY
vercel env add DEAFAUTH_CLIENT_ID
vercel env add DEAFAUTH_CLIENT_SECRET
vercel env add PINKSYNC_API_KEY
vercel env add FIBONROSE_API_KEY
vercel env add AWS_ACCESS_KEY_ID
vercel env add AWS_SECRET_ACCESS_KEY
vercel env add FIREBASE_PROJECT_ID
vercel env add FIREBASE_API_KEY
# ... add all other required variables
```

### 5.5 Deploy to Vercel

```bash
# Deploy to preview
vercel

# Deploy to production
vercel --prod
```

### 5.6 Configure Custom Domain (Optional)

1. In Vercel dashboard, go to your project
2. Settings → Domains
3. Add domain: `app.vr4deaf.org`
4. Follow DNS configuration instructions

## Step 6: Configure mbtq.dev Protocol

### 6.1 DeafAuth Setup

1. Register application at DeafAuth portal
2. Get client ID and secret
3. Configure redirect URIs:
   - `https://app.vr4deaf.org/auth/callback`
   - `https://your-preview.vercel.app/auth/callback`

### 6.2 PinkSync Setup

1. Register for PinkSync API access
2. Get API key
3. Configure webhook URL for session updates

### 6.3 FibonRose Setup

1. Get FibonRose API key
2. Configure analytics preferences
3. Set up data sync endpoints

## Step 7: Post-Deployment Configuration

### 7.1 Verify Deployment

```bash
# Check Vercel deployment
vercel ls

# Check Firebase deployment
firebase projects:list

# Test AWS services
aws s3 ls s3://vr4deaf-sign-language-videos-raw
```

### 7.2 Test Application

1. Visit your Vercel URL
2. Test authentication (DeafAuth)
3. Upload a test video (AWS S3)
4. Schedule interpreter session (PinkSync)
5. Run business analysis (FibonRose)

### 7.3 Configure Monitoring

#### Vercel Analytics
```bash
vercel analytics
```

#### AWS CloudWatch
Set up alarms for:
- Lambda errors
- S3 bucket size
- MediaConvert job failures

#### Firebase Performance
Enable in Firebase Console → Performance

### 7.4 Set Up Backups

#### Database Backups
Configure automated backups through your database provider.

#### Firebase Backups
```bash
firebase deploy --only firestore:rules
```

## Step 8: CI/CD Setup (GitHub Actions)

### 8.1 Add Secrets to GitHub

1. Go to repository Settings → Secrets
2. Add secrets:
   - `VERCEL_TOKEN`
   - `VERCEL_ORG_ID`
   - `VERCEL_PROJECT_ID`
   - `FIREBASE_SERVICE_ACCOUNT`
   - All other environment variables

### 8.2 Verify Workflow

The `.github/workflows/ci-cd.yml` should already be configured.

Push to main branch to trigger deployment:

```bash
git push origin main
```

## Step 9: Domain Configuration

### 9.1 DNS Records

Configure DNS for custom domains:

**Main Application** (`app.vr4deaf.org`):
- Type: CNAME
- Value: `cname.vercel-dns.com`

**Videos CDN** (`videos.vr4deaf.org`):
- Type: CNAME
- Value: Your CloudFront distribution domain

**API** (`api.vr4deaf.org`):
- Type: CNAME
- Value: Your API endpoint

### 9.2 SSL Certificates

- Vercel: Automatic SSL via Let's Encrypt
- CloudFront: Configure ACM certificate
- Firebase: Automatic SSL

## Step 10: Monitoring and Maintenance

### 10.1 Set Up Monitoring

**Vercel**:
- Enable Analytics
- Configure error tracking

**AWS**:
- CloudWatch dashboards
- Cost alerts
- Performance alarms

**Firebase**:
- Performance monitoring
- Crashlytics (for mobile)

### 10.2 Regular Maintenance

Weekly:
- Review error logs
- Check API usage
- Monitor costs

Monthly:
- Update dependencies
- Review security
- Optimize performance

## Troubleshooting

### Common Issues

#### Deployment Fails
```bash
# Check build logs
vercel logs
```

#### Database Connection Error
- Verify DATABASE_URL is correct
- Check SSL mode requirement
- Ensure database allows connections from Vercel IPs

#### Video Processing Not Working
- Check Lambda function logs in CloudWatch
- Verify S3 event notifications are configured
- Test MediaConvert job creation manually

#### Authentication Issues
- Verify DeafAuth credentials
- Check redirect URIs match exactly
- Ensure HTTPS is used

### Support

- **Technical Issues**: tech@vr4deaf.org
- **Documentation**: [GitHub](https://github.com/vr4deaf/Business_Magician_-Express)
- **Community**: [VR4Deaf Forum](https://community.vr4deaf.org)

## Cost Estimation

### Monthly Costs (Estimated)

**Vercel**:
- Free tier: $0 (for hobby projects)
- Pro: $20/month

**AWS**:
- S3 Storage: ~$2-5/month (50-100 GB)
- MediaConvert: ~$10-20/month (100-200 videos)
- Lambda: ~$1/month (within free tier)
- CloudFront: ~$5-10/month (100-200 GB)
- **Total AWS**: ~$18-36/month

**Firebase**:
- Spark (Free): $0 (limited)
- Blaze (Pay as you go): ~$10-25/month
  - Firestore: ~$5-10
  - Storage: ~$3-5
  - Functions: ~$2-10

**Database** (Neon/Supabase):
- Free tier: $0
- Pro: $25/month

**Total Estimated Cost**: $53-106/month

Free tier options can reduce this to ~$0-25/month for initial deployment.

## Scaling Considerations

### When to Scale

- **Users**: 1,000+ active users
- **Videos**: 500+ videos/month processing
- **Database**: 10+ GB data
- **Traffic**: 1M+ requests/month

### Scaling Options

1. **Vercel**: Upgrade to Pro or Enterprise
2. **AWS**: Increase Lambda memory, use Reserved Instances
3. **Firebase**: Move to dedicated Firestore
4. **Database**: Upgrade to higher tier, add read replicas

## Security Checklist

- [ ] All API keys stored as environment variables
- [ ] HTTPS enforced everywhere
- [ ] Firebase security rules configured
- [ ] S3 buckets not publicly writable
- [ ] IAM roles follow least privilege
- [ ] Rate limiting enabled
- [ ] CORS properly configured
- [ ] Regular security audits scheduled

## Next Steps

1. Configure monitoring and alerts
2. Set up user onboarding flow
3. Create admin dashboard
4. Implement analytics tracking
5. Plan for mobile app deployment
6. Scale as user base grows

---

**Last Updated**: December 2024
**Maintained By**: VR4Deaf Technical Team
**Contact**: tech@vr4deaf.org
