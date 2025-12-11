# 360 Business Magician: VR Business Specialist + VR Client

A comprehensive business formation platform for deaf entrepreneurs, providing tools for business development, document management, and self-employment services. Part of the **VR4Deaf** ecosystem, supporting deaf business owners and job seekers across the USA through virtual and in-person services.

[![CI/CD](https://github.com/pinkycollie/Business_Magician_-Express/actions/workflows/ci-cd.yml/badge.svg)](https://github.com/pinkycollie/Business_Magician_-Express/actions/workflows/ci-cd.yml)

## 🌐 VR4Deaf Ecosystem

This platform is part of the [VR4Deaf](https://vr4deaf.org) network, a vendor for vocational rehabilitation and workforce solutions supporting deaf business owners and deaf job seekers. VR4Deaf provides a network of specialists and coaches using a deaf-first platform designed with **mbtq.dev protocol** components:

- **DeafAuth**: Accessible authentication system designed for the deaf community
- **PinkSync**: Real-time communication and translation service integration
- **FibonRose**: AI-powered business analytics and matching algorithms

### The Magicians Ecosystem

The platform consists of four specialized AI agent copilots, each providing contextual support for deaf users:

1. **Business Magician**: Complete business lifecycle support (idea → build → grow → manage)
2. **Job Magician**: Job search, career development, and employment support
3. **Developer Magician**: Technical training, coding resources, and development tools
4. **Creative Magician**: Creative services, branding, and multimedia production

## 📖 Documentation & Demo

**[View Interactive Demo →](https://pinkycollie.github.io/Business_Magician_-Express/)**

The demo page provides an interactive overview of the platform features, including:
- Blueprint Generator demonstration
- VR Service Cost Calculator
- VR Workflow visualization

## 🚀 Features

- **Complete Business Lifecycle Support**: From idea generation to business growth and management
- **ASL Video Guidance**: Accessible content in American Sign Language
- **Document Management**: Storage and organization for business documents
- **Self-Employment Service Modules**: Comprehensive pricing tools
- **VR Counselor Integration**: Connect with Vocational Rehabilitation specialists through VR4Deaf network
- **SBA Resource Library**: Access to Small Business Administration resources
- **AI-Powered Tools**: Tools for business ideation and planning
- **DeafAuth Integration**: Secure, accessible authentication for deaf users
- **PinkSync Communication**: Real-time interpreter scheduling and communication support
- **FibonRose Analytics**: AI-powered business matching and decision support

## 🔧 Technologies

- React + TypeScript frontend (deployed on **Vercel**)
- Express.js backend
- PostgreSQL database with Drizzle ORM
- HTMX for dynamic interactions
- **AWS**: Video processing for sign language content
- **Google Cloud/Firebase**: Database, storage, and cloud functions
- Shadcn/UI components
- DeafAuth authentication protocol
- PinkSync communication API
- FibonRose AI analytics engine

## 📋 Requirements

- Node.js 20+
- PostgreSQL database (or use Docker)
- OpenAI API key (for AI features, optional)
- Notion API key (for integration, optional)

## 🏁 Getting Started

### Quick Start

1. Clone the repository:
   ```bash
   git clone https://github.com/pinkycollie/Business_Magician_-Express.git
   cd Business_Magician_-Express
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

# VR4Deaf Platform Integration
VR4DEAF_API_KEY=your-vr4deaf-api-key
VR4DEAF_API_URL=https://api.vr4deaf.org

# mbtq.dev Protocol Components
DEAFAUTH_CLIENT_ID=your-deafauth-client-id
DEAFAUTH_CLIENT_SECRET=your-deafauth-secret
PINKSYNC_API_KEY=your-pinksync-api-key
FIBONROSE_API_KEY=your-fibonrose-api-key

# Cloud Infrastructure
# Vercel (Frontend)
VERCEL_TOKEN=your-vercel-token

# AWS (Video Processing)
AWS_ACCESS_KEY_ID=your-aws-access-key
AWS_SECRET_ACCESS_KEY=your-aws-secret-key
AWS_REGION=us-east-1
AWS_S3_BUCKET=vr4deaf-sign-language-videos

# Google Cloud/Firebase (Database & Storage)
GOOGLE_CLOUD_PROJECT_ID=vr4deaf-business-magician
GOOGLE_CLOUD_BUCKET_NAME=vr4deaf-documents
GOOGLE_APPLICATION_CREDENTIALS=path-to-credentials.json
FIREBASE_PROJECT_ID=vr4deaf-business-magician
FIREBASE_API_KEY=your-firebase-api-key

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

- **VR4Deaf Network**: [vr4deaf.org](https://vr4deaf.org)
- 360 Magician Development Team
- Network of VR Specialists and Business Coaches

## 🔗 Related Resources

- **VR4Deaf Organization**: [github.com/vr4deaf](https://github.com/vr4deaf)
- **VR4Deaf Website**: [vr4deaf.org](https://vr4deaf.org)
- **VR4Deaf Bot**: [t.me/vr4deaf_bot](https://t.me/vr4deaf_bot)
- **MBTQ Protocol**: [mbtq.dev](https://mbtq.dev)

## 🌟 About VR4Deaf

VR4Deaf is a comprehensive vendor for vocational rehabilitation and workforce solutions, specifically designed to support deaf business owners and job seekers across the United States. We provide:

- **Virtual Services**: Remote support accessible anywhere
- **In-Person Services**: On-site assistance when needed
- **Network of Specialists**: Expert business coaches and VR counselors
- **Deaf-First Platform**: Built with accessibility and the deaf community in mind
- **mbtq.dev Protocol**: Advanced authentication, communication, and analytics tools

The platform integrates with:
- **Vercel**: Frontend hosting and deployment
- **AWS**: Video processing for sign language content
- **Google Cloud/Firebase**: Database, storage, and cloud functions