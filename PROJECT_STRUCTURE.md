# Project Structure

Complete overview of the AI Automation Suite project structure.

## Directory Tree

```
ai-automation-suite/
│
├── frontend/                          # React Frontend Application
│   ├── src/
│   │   ├── components/
│   │   │   └── Layout.jsx            # Main layout with sidebar navigation
│   │   ├── context/
│   │   │   └── AuthContext.jsx       # Authentication context provider
│   │   ├── pages/
│   │   │   ├── Login.jsx             # Login page
│   │   │   ├── Dashboard.jsx         # Main dashboard
│   │   │   ├── CustomerSupportAgent.jsx    # Support agent UI
│   │   │   ├── DataAnalyticsAgent.jsx      # Analytics agent UI
│   │   │   ├── MarketingAutomationAgent.jsx # Marketing agent UI
│   │   │   └── AdminPanel.jsx        # Admin configuration panel
│   │   ├── App.jsx                   # Main app component with routing
│   │   ├── main.jsx                  # React entry point
│   │   └── index.css                 # Global styles (Tailwind)
│   ├── index.html                    # HTML template
│   ├── package.json                  # Frontend dependencies
│   ├── vite.config.js                # Vite configuration
│   ├── tailwind.config.js            # Tailwind CSS configuration
│   └── postcss.config.js             # PostCSS configuration
│
├── backend/                           # AWS Lambda Backend
│   ├── src/
│   │   ├── support/                  # Customer Support Agent
│   │   │   └── chat.js               # Chat handler with Bedrock integration
│   │   ├── analytics/                # Data Analytics Agent
│   │   │   ├── data.js               # Data fetcher (mock CRM)
│   │   │   ├── analyze.js            # AI analysis with Bedrock
│   │   │   └── export.js             # Export to Slack
│   │   ├── marketing/                # Marketing Automation Agent
│   │   │   ├── posts.js              # Post management (GET/POST)
│   │   │   ├── generate.js           # AI content generation
│   │   │   └── recommendations.js    # Marketing recommendations
│   │   └── admin/                    # Admin Panel
│   │       └── config.js             # Configuration management
│   ├── local-server.js               # Express server for local dev
│   ├── template.yaml                 # AWS SAM template
│   ├── samconfig.toml                # SAM deployment configuration
│   └── package.json                  # Backend dependencies
│
├── config/                            # Configuration Files
│   └── dynamodb-schema.json          # DynamoDB table schemas
│
├── .gitignore                        # Git ignore rules
├── env.example                       # Environment variables template
├── package.json                      # Root package.json with scripts
├── README.md                         # Main documentation
├── QUICKSTART.md                     # Quick start guide
├── DEPLOYMENT.md                     # Deployment checklist
└── PROJECT_STRUCTURE.md              # This file
```

## Key Files Explained

### Frontend

- **`frontend/src/App.jsx`**: Main application component with React Router setup
- **`frontend/src/components/Layout.jsx`**: Sidebar navigation and layout wrapper
- **`frontend/src/pages/*.jsx`**: Individual page components for each agent
- **`frontend/vite.config.js`**: Vite configuration with API proxy setup

### Backend

- **`backend/template.yaml`**: AWS SAM template defining all infrastructure
- **`backend/src/*/`**: Lambda function handlers organized by agent
- **`backend/local-server.js`**: Express server for local development

### Configuration

- **`env.example`**: Template for environment variables
- **`config/dynamodb-schema.json`**: DynamoDB table definitions
- **`backend/samconfig.toml`**: SAM deployment configuration

## API Endpoints

All endpoints are prefixed with `/api`:

### Customer Support
- `POST /api/support/chat` - Send message to support agent

### Data Analytics
- `GET /api/analytics/data` - Fetch CRM data
- `POST /api/analytics/analyze` - Generate AI insights
- `POST /api/analytics/export` - Export to Slack

### Marketing
- `GET /api/marketing/posts` - Get scheduled posts
- `POST /api/marketing/posts` - Schedule new post
- `POST /api/marketing/generate` - Generate post content
- `POST /api/marketing/recommendations` - Get recommendations

### Admin
- `GET /api/admin/config` - Get configuration
- `POST /api/admin/config` - Update configuration

## AWS Resources

### DynamoDB Tables
- `SupportTickets` - Customer support tickets
- `MarketingPosts` - Scheduled social media posts
- `SystemConfig` - System configuration

### Lambda Functions
- `SupportChatFunction` - Customer support chat handler
- `AnalyticsDataFunction` - Data fetcher
- `AnalyticsAnalyzeFunction` - AI analysis
- `AnalyticsExportFunction` - Export handler
- `MarketingPostsFunction` - Post management
- `MarketingGenerateFunction` - Content generation
- `MarketingRecommendationsFunction` - Recommendations
- `AdminConfigFunction` - Configuration management

### API Gateway
- REST API with all endpoints configured
- CORS enabled for frontend access

## Development Workflow

1. **Local Development**
   - Start backend: `cd backend && npm run dev`
   - Start frontend: `cd frontend && npm run dev`
   - Access: http://localhost:3000

2. **Testing**
   - Test locally with mock data
   - Use local Express server for API
   - Frontend proxies to backend automatically

3. **Deployment**
   - Build: `cd backend && sam build`
   - Deploy: `sam deploy --guided`
   - Deploy frontend to Amplify or S3

## Dependencies

### Frontend
- React 18
- React Router
- Tailwind CSS
- Axios
- Recharts
- Lucide React

### Backend
- AWS SDK v3
- Express (local dev only)
- CORS (local dev only)

## Notes

- All Lambda functions are designed to work with both API Gateway and local Express server
- Mock data is used for CRM and social media integrations (placeholders)
- Bedrock integration is ready but requires AWS account setup
- Authentication is placeholder - implement proper auth for production

