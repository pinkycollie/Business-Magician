# 360 Business Magician: VR Business Specialist + VR Client

A comprehensive business formation platform for deaf entrepreneurs, providing tools for business development, document management, and self-employment services.

[![CI/CD](https://github.com/pinkycollie/Business-Magician/actions/workflows/ci-cd.yml/badge.svg)](https://github.com/pinkycollie/Business-Magician/actions/workflows/ci-cd.yml)

## 📖 Documentation & Demo

**[View Interactive Demo →](https://pinkycollie.github.io/Business-Magician/)**

The demo page provides an interactive overview of the platform features, including:
- Blueprint Generator demonstration
- VR Service Cost Calculator
- VR Workflow visualization

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
- Google Cloud Storage integration (optional)
- Shadcn/UI components

## 📋 Requirements

- Node.js 20+
- PostgreSQL database (or use Docker)
- OpenAI API key (for AI features, optional)
- Notion API key (for integration, optional)

## 🏁 Getting Started

### Quick Start

1. Clone the repository:
   ```bash
   git clone https://github.com/pinkycollie/Business-Magician.git
   cd Business-Magician
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Copy environment example and configure:
   ```bash
   cp .env.example .env
   # Edit .env with your configuration
   ```

4. Start the development server:
   ```bash
   npm run dev
   ```

5. Visit http://localhost:5000 to see the application.

### Docker Setup

We provide a Docker Compose configuration for easy local development:

```bash
docker-compose up -d
```

Visit http://localhost:8080 to see the application.

## 🗄️ Environment Variables

Create a `.env` file in the project root with the following variables:

```env
# Database connection
DATABASE_URL=postgres://username:password@localhost:5432/business_magician

# Application settings
NODE_ENV=development
PORT=5000
```

## 📂 Project Structure

```
├── client/                  # Frontend React application
│   ├── src/
│   │   ├── components/      # UI components
│   │   ├── hooks/           # Custom React hooks
│   │   ├── lib/             # Utilities and API clients
│   │   └── pages/           # Page components
├── server/                  # Backend Express application
│   ├── routes/              # API routes
│   ├── services/            # Business logic
│   └── index.ts             # Server entry point
├── shared/                  # Shared code between client and server
│   └── schema.ts            # Database schema definitions
├── docs/                    # GitHub Pages documentation
├── scripts/                 # Utility scripts
└── views/                   # HTMX view templates
```

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

## 📜 Available Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start development server |
| `npm run build` | Build for production |
| `npm run start` | Run production build |
| `npm run typecheck` | Run TypeScript type checking |
| `npm run lint` | Run linting |
| `npm run db:push` | Push schema changes to database |
| `npm run db:studio` | Open database management UI |

## 🧪 Local Development Tips

### Running Without Database

For quick frontend prototyping, you can run the demo HTML files directly:

```bash
# Open the demo page in your browser
open 360-magician-demo.html
```

### Using the Test Server

```bash
node test-server.js
```

## 🤝 Contributing

Please see [CONTRIBUTING.md](CONTRIBUTING.md) for guidelines on contributing to this project.

## 📄 License

[MIT License](LICENSE)

## 👥 Team

- 360 Magician Team
