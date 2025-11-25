# 360 Business Magician: VR Business Specialist + VR Client

A comprehensive business formation platform for deaf entrepreneurs, providing tools for business development, document management, and self-employment services.

![360 Business Magician](https://business.360magicians.com)

## 🏗️ Project Structure

The project is organized into a clean, modular structure:

```
├── src/                         # Reorganized source code
│   ├── api/                     # API layer
│   │   └── v1/                  # API version 1
│   │       ├── routes/          # API route handlers
│   │       │   ├── health.ts    # Health check endpoints
│   │       │   ├── business.ts  # Business Magician endpoints
│   │       │   ├── v4deaf.ts    # V4Deaf endpoints
│   │       │   ├── pinksync.ts  # PinkSync endpoints
│   │       │   └── automation.ts # PinkFlow automation endpoints
│   │       └── index.ts         # API router entry point
│   ├── modules/                 # Feature modules
│   │   ├── v4deaf/              # VR4Deaf module (VR counselor integration)
│   │   ├── business-magician/   # Business formation & analytics
│   │   ├── pinksync/            # Deaf-first platform transformation
│   │   └── pinkflow/            # Automation & workflow orchestration
│   ├── shared/                  # Shared resources
│   │   ├── types/               # Common type definitions
│   │   ├── utils/               # Utility functions
│   │   └── config/              # Configuration management
│   └── index.ts                 # Main entry point
├── client/                      # Frontend React application (APP)
│   └── src/
│       ├── components/          # UI components
│       ├── hooks/               # Custom React hooks
│       ├── lib/                 # Utilities and API clients
│       └── pages/               # Page components
├── server/                      # Legacy server (being migrated)
│   ├── routes/                  # API routes
│   └── services/                # Business logic
└── shared/                      # Legacy shared code
    └── schema.ts                # Database schema definitions
```

## 🚀 Features

- **Complete Business Lifecycle Support**: From idea generation to business growth and management
- **ASL Video Guidance**: Accessible content in American Sign Language
- **Document Management**: Storage and organization for business documents
- **Self-Employment Service Modules**: Comprehensive pricing tools
- **VR Counselor Integration**: Connect with Vocational Rehabilitation specialists
- **SBA Resource Library**: Access to Small Business Administration resources
- **AI-Powered Tools**: Tools for business ideation and planning

## 📦 Modules

### Business Magician
Business formation and management services including:
- Business idea generation
- Formation (LLC, Corporation, etc.)
- Market analytics
- Lifecycle phase tracking

### V4Deaf (VR4Deaf)
VR counselor integration and accessibility services:
- VR counselor connections
- ASL dictionary and videos
- Accommodation management
- Progress tracking

### PinkSync
Deaf-first platform transformation:
- Platform accessibility analysis
- Deaf-first module installation
- Communication preferences
- Real-time captioning

### PinkFlow
Automation and workflow orchestration:
- Workflow management
- Event processing
- Integration hub
- Sync operations

## 🔧 Technologies

- React + TypeScript frontend
- Express.js backend
- PostgreSQL database with Drizzle ORM
- HTMX for dynamic interactions
- Google Cloud Storage integration
- Telegram bot integration
- Shadcn/UI components
- Vercel deployment

## 📋 Requirements

- Node.js 20+
- PostgreSQL database (or use Docker)
- Google Cloud Storage account (for document storage)
- OpenAI API key (for AI features)

## 🏁 Getting Started

### Quick Start

1. Clone the repository
2. Run setup script:
   ```bash
   node scripts/setup.js
   ```
3. Start the development server:
   ```bash
   npm run dev
   ```

### Docker Setup

We provide a Docker Compose configuration for easy local development:

```bash
docker-compose up -d
```

Visit http://localhost:8080 to see the application.

## 🗄️ Environment Variables

Create a `.env` file in the project root with the following variables:

```
# Database connection
DATABASE_URL=postgres://username:password@localhost:5432/business_magician

# Google Cloud Storage
GOOGLE_CLOUD_PROJECT_ID=your-project-id
GOOGLE_CLOUD_BUCKET_NAME=your-bucket-name
GOOGLE_APPLICATION_CREDENTIALS=path-to-credentials.json

# OpenAI
OPENAI_API_KEY=your-openai-api-key

# Application settings
NODE_ENV=development
PORT=5000
```

## 📂 Project Structure

See the structure at the top of this document for the complete directory layout.

## 🔌 API Endpoints

### Health & Status
- `GET /api/v1/health` - Basic health check
- `GET /api/v1/health/detailed` - Detailed health with service status

### Business Magician
- `GET /api/v1/business/formations` - List formations
- `POST /api/v1/business/formations` - Create business formation
- `GET /api/v1/business/analytics` - Get analytics
- `POST /api/v1/business/analytics/analyze` - Analyze business
- `GET /api/v1/business/lifecycle` - Get lifecycle phases
- `GET /api/v1/business/tools` - List available tools

### V4Deaf (VR4Deaf)
- `GET /api/v1/v4deaf/counselors` - List VR counselors
- `GET /api/v1/v4deaf/asl/dictionary` - Get ASL dictionary
- `GET /api/v1/v4deaf/asl/videos` - Get ASL videos
- `POST /api/v1/v4deaf/accommodations/request` - Request accommodation
- `GET /api/v1/v4deaf/users/:userId/progress` - Get user progress

### PinkSync
- `GET /api/v1/pinksync/status` - Service status
- `POST /api/v1/pinksync/analyze` - Analyze platform accessibility
- `POST /api/v1/pinksync/transform` - Transform platform
- `GET /api/v1/pinksync/modules` - List available modules
- `GET /api/v1/pinksync/preferences/:userId` - Get user preferences

### Automation (PinkFlow)
- `GET /api/v1/automation/workflows` - List workflows
- `POST /api/v1/automation/workflows` - Create workflow
- `POST /api/v1/automation/workflows/:id/start` - Start workflow
- `POST /api/v1/automation/sync/business-vr` - Sync business-VR data
- `GET /api/v1/automation/integrations` - List integrations

## 🔄 Database Management

We use Drizzle ORM for database operations. Some useful commands:

```bash
# Push schema changes to database
npm run db:push

# Generate migration files
npm run db:generate

# Open Drizzle Studio (database UI)
npm run db:studio
```

## 📦 Deployment

The application is configured for deployment on Vercel:

```bash
node scripts/vercel-deploy.js
```

## 🤝 Contributing

Please see [CONTRIBUTING.md](CONTRIBUTING.md) for guidelines on contributing to this project.

## 📄 License

[MIT License](LICENSE)

## 👥 Team

- 360 Magician Team