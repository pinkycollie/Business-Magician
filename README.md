# 360 Business Magician: VR Business Specialist + VR Client

A comprehensive business formation platform for deaf entrepreneurs, providing tools for business development, document management, and self-employment services.

[![CI/CD](https://github.com/pinkycollie/Business-Magician/actions/workflows/ci-cd.yml/badge.svg)](https://github.com/pinkycollie/Business-Magician/actions/workflows/ci-cd.yml)

## 📖 Documentation & Demo

**[View Interactive Demo →](https://pinkycollie.github.io/Business-Magician/)**

The demo page provides an interactive overview of the platform features, including:
- Blueprint Generator demonstration
- VR Service Cost Calculator
- VR Workflow visualization

## 🚀 Features

- **Complete Business Lifecycle Support**: From idea generation to business growth and management
- **ASL Video Guidance**: Accessible content in American Sign Language
- **Document Management**: Storage and organization for business documents
- **Self-Employment Service Modules**: Comprehensive pricing tools
- **VR Counselor Integration**: Connect with Vocational Rehabilitation specialists
- **SBA Resource Library**: Access to Small Business Administration resources
- **AI-Powered Tools**: Tools for business ideation and planning

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

# Optional: Google Cloud Storage
GOOGLE_CLOUD_PROJECT_ID=your-project-id
GOOGLE_CLOUD_BUCKET_NAME=your-bucket-name
GOOGLE_APPLICATION_CREDENTIALS=path-to-credentials.json

# Optional: AI Services
OPENAI_API_KEY=your-openai-api-key
ANTHROPIC_API_KEY=your-anthropic-api-key

# Optional: Notion Integration
NOTION_API_KEY=your-notion-api-key
NOTION_DATABASE_ID=your-database-id

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