# 360 Business Magician

> **Author**: Pinky Collie  
> **Organization**: 360 Magicians  
> **Platform**: [businessmagician.vr4deaf.org](https://businessmagician.vr4deaf.org)  
> **Monorepo**: [github.com/pinkycollie/vr4deaf](https://github.com/pinkycollie/vr4deaf) → `/businessmagician`

A comprehensive AI-powered business formation platform for deaf entrepreneurs, providing complete business lifecycle support with Vocational Rehabilitation integration and ADA compliance.

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

This module is part of the **VR4Deaf monorepo**:

## 📦 Modules

### Business Magician
Business formation and management services including:
- Business idea generation
- Formation (LLC, Corporation, etc.)
- Market analytics
- Lifecycle phase tracking

### V4Deaf (VR4Deaf)
VR Specialists integration and accessibility services:
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

## 🎯 Overview

Business Magician is part of the **360 Magicians** ecosystem - a suite of AI agents designed to empower the deaf community. This platform guides deaf entrepreneurs through the complete business journey:

```
💡 IDEA  →  🏗️ BUILD  →  📈 GROW  →  ⚙️ MANAGED
```

### What Makes Us Different

- **Deaf-First Design**: Visual communication, ASL integration, and deaf culture awareness
- **VR Integration**: Deep integration with Vocational Rehabilitation self-employment programs
- **ADA Compliance**: Built-in accessibility and compliance checking
- **AI-Powered**: Intelligent guidance through every business phase
- **Web3 Ready**: Prepared for decentralized identity and blockchain integration

## 🚀 Features

### Business Lifecycle Support

| Phase | Features |
|-------|----------|
| **💡 IDEA** | Business ideation, market research, feasibility studies, VR counselor tools |
| **🏗️ BUILD** | Entity formation, EIN application, licensing, compliance checklists |
| **📈 GROW** | Marketing strategy, customer acquisition, financial tracking, scaling |
| **⚙️ MANAGED** | Compliance monitoring, renewals, business health dashboards |

### Platform Capabilities

- ✅ 360-degree interactive business journey
- ✅ Corporate formation services with pricing
- ✅ Butch AI assistant with ASL integration
- ✅ Team collaboration tools
- ✅ Admin dashboard with analytics
- ✅ Small Business API integration
- ✅ Real-time WebSocket communication
- ✅ Automated code generation system

### Accessibility Features

- ASL video players with custom controls
- Screen reader compatibility
- Keyboard navigation
- High contrast mode
- Visual notification systems
- WCAG 2.1 AA compliance

## 🛠️ Technology Stack

### Current Platform
- **Frontend**: React 18 + TypeScript + Vite
- **Backend**: Express.js + Node.js 20+
- **Database**: PostgreSQL + Drizzle ORM
- **UI**: Shadcn/UI + Tailwind CSS + HTMX
- **AI**: Anthropic Claude / OpenAI
- **Real-time**: Socket.io + WebSocket

### Deployment
- **Hosting**: nginx on vr4deaf.org
- **Containers**: Docker + Docker Compose
- **CI/CD**: GitHub Actions
- **Storage**: Google Cloud Storage

### Future (Web3 Integration)
- Multi-chain wallet support
- Smart contract business registry
- IPFS document storage
- Zero-knowledge proofs
- Layer 2 scaling

## 📋 Quick Start

### Prerequisites
- Node.js 20+
- PostgreSQL database (or Docker)
- API keys for AI services

### Installation

```bash
# Clone the repository
git clone https://github.com/pinkycollie/vr4deaf.git
cd vr4deaf/business

# Install dependencies
npm install

# Run setup script
node scripts/setup.js

# Start development server
npm run dev
```

### Docker Setup

```bash
docker-compose up -d
```

Visit http://localhost:8080 to see the application.

## 🔧 Code Generation

### Plop Generators

```bash
# Business component with ASL support
plop business-component

# Complete business tool
plop business-tool

# ASL video component
plop asl-component

# Full-stack feature
plop feature

# API endpoint with auth
plop api-endpoint
```

### Yeoman Generator

```bash
# Install generator
npm install -g generator-360-business-magician

# Create new project
yo 360-business-magician
```

## 📂 Project Structure

```
360-business-magician/
├── .github/workflows/          # CI/CD automation
├── archive/                    # Archived legacy files
├── client/src/                 # React frontend
│   ├── components/             # UI components
│   ├── hooks/                  # Custom React hooks
│   ├── lib/                    # Utilities and API clients
│   └── pages/                  # Page components
├── docs/                       # Documentation
│   ├── AGENTS.md               # Agent architecture
│   ├── CONTEXT.md              # Platform context
│   └── PROMPTS.md              # AI prompts library
├── generator-360-business-magician/  # Yeoman generator
├── server/                     # Express backend
│   ├── routes/                 # API routes
│   ├── services/               # Business logic
│   └── index.ts                # Server entry point
├── shared/                     # Shared code
│   └── schema.ts               # Database schema
├── templates/                  # Plop templates
├── views/                      # HTMX templates
└── plopfile.js                 # Generator configuration
```

## 🗄️ Environment Variables

Create a `.env` file in the project root:

```env
# Database
DATABASE_URL=postgres://username:password@localhost:5432/business_magician

# AI Services
ANTHROPIC_API_KEY=your-anthropic-key
OPENAI_API_KEY=your-openai-key

# Google Cloud
GOOGLE_CLOUD_PROJECT_ID=your-project-id
GOOGLE_CLOUD_BUCKET_NAME=your-bucket-name
GOOGLE_APPLICATION_CREDENTIALS=path-to-credentials.json

# External Services
NOTION_API_KEY=your-notion-key
NORTHWEST_API_KEY=your-northwest-key

# Application
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

```bash
# Push schema changes
npm run db:push

# Generate migrations
npm run db:generate

# Open Drizzle Studio
npm run db:studio
```

## 🚢 Deployment

### Production (nginx)
The application is deployed on nginx at businessmagician.vr4deaf.org

### Docker Deployment
```bash
docker-compose -f docker-compose.prod.yml up -d
```

### GitHub Actions
Automated deployment on push to main branch via GitHub Actions.

## 🔗 API Integrations

| Service | Purpose |
|---------|---------|
| Anthropic AI | Intelligent business guidance |
| Notion API | Content management |
| Northwest Agent | Business formation services |
| SBA API | Small business resources |
| Stripe | Payment processing |

## 📚 Documentation

- [AGENTS.md](docs/AGENTS.md) - Agent architecture and capabilities
- [CONTEXT.md](docs/CONTEXT.md) - Platform context and user understanding
- [PROMPTS.md](docs/PROMPTS.md) - AI prompts library
- [CONTRIBUTING.md](CONTRIBUTING.md) - Contribution guidelines
- [README-GENERATOR.md](README-GENERATOR.md) - Code generation documentation

## 🤝 Contributing

Please see [CONTRIBUTING.md](CONTRIBUTING.md) for guidelines on contributing to this project.

## 📄 License

[MIT License](LICENSE)

## 👥 Team

- **Author**: Pinky Collie
- **Organization**: 360 Magicians
- **Platform**: VR4Deaf.org

---

*Business Magician - Empowering Deaf Entrepreneurs*  
*Part of the 360 Magicians Ecosystem*  
*© 2024 Pinky Collie & 360 Magicians*