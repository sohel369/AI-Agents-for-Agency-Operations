# AI Automation Suite

A fully functional and modular AI Automation Suite built with React (frontend) and AWS (backend) for an AI consulting agency. This suite includes three intelligent AI agents that integrate with CRM, email marketing software, and social platforms.

## 🌐 Project Overview

This project consists of three smart AI agents:

1. **Customer Support Agent** - AI-powered customer support with intelligent ticket triage
2. **Data Analytics Agent** - Analyze CRM data and generate actionable insights
3. **Marketing Automation Agent** - Schedule posts, generate content, and track engagement metrics

## ⚙️ Tech Stack

### Frontend
- **React 18** - UI framework
- **Vite** - Build tool and dev server
- **Tailwind CSS** - Utility-first CSS framework
- **React Router** - Client-side routing
- **Axios** - HTTP client
- **Recharts** - Data visualization
- **Lucide React** - Icon library

### Backend
- **AWS Lambda** - Serverless compute
- **API Gateway** - REST API management
- **DynamoDB** - NoSQL database
- **AWS Bedrock** - Foundation model access (Claude, Titan, Llama)
- **AWS SAM** - Infrastructure as Code

## 📁 Project Structure

```
ai-automation-suite/
├── frontend/                 # React frontend application
│   ├── src/
│   │   ├── components/      # Reusable UI components
│   │   ├── pages/           # Page components
│   │   ├── context/         # React context providers
│   │   ├── App.jsx          # Main app component
│   │   └── main.jsx         # Entry point
│   ├── package.json
│   ├── vite.config.js
│   └── tailwind.config.js
├── backend/                  # AWS Lambda functions
│   ├── src/
│   │   ├── support/         # Customer Support Agent
│   │   ├── analytics/       # Data Analytics Agent
│   │   ├── marketing/       # Marketing Automation Agent
│   │   └── admin/           # Admin Panel
│   ├── template.yaml        # AWS SAM template
│   └── package.json
├── config/                   # Configuration files
│   ├── dynamodb-schema.json # DynamoDB table schemas
│   └── .env.example         # Environment variables template
├── package.json             # Root package.json
└── README.md               # This file
```

## 🚀 Getting Started

### Prerequisites

**For Local Development (No AWS Required):**
- **Node.js** 18+ and npm
- **Git** for version control

**For AWS Deployment:**
- **AWS CLI** configured with appropriate credentials
- **AWS SAM CLI** installed
- **AWS Account** with Bedrock access enabled

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd ai-automation-suite
   ```

2. **Install dependencies**
   ```bash
   # Install all dependencies (frontend + backend)
   npm run install:all

   # Or install separately
   npm run install:frontend
   npm run install:backend
   ```

3. **Configure environment variables (Optional for Local Development)**
   ```bash
   # Copy the example env file (optional)
   cp env.example .env

   # For LOCAL DEVELOPMENT: No AWS credentials needed!
   # The app automatically runs in MOCK MODE when AWS credentials are missing.
   # Just skip this step or leave AWS credentials empty.

   # For AWS DEPLOYMENT: Edit .env with your AWS credentials
   # Update AWS_REGION, BEDROCK_MODEL_ID, API keys, etc.
   ```

### Local Development

#### 🎯 Running Without AWS (Mock Mode)

**The application automatically runs in MOCK MODE when AWS credentials are not provided!**

This means you can:
- ✅ Run the entire application locally
- ✅ Test all features with mock AI responses
- ✅ No AWS account or credentials needed
- ✅ Perfect for development and testing

**How it works:**
- If `AWS_ACCESS_KEY_ID` and `AWS_SECRET_ACCESS_KEY` are missing, the app automatically uses mock mode
- Mock Bedrock service provides realistic AI responses
- In-memory storage replaces DynamoDB
- All features work exactly as they would with real AWS services

#### Frontend Development

1. **Start the development server**
   ```bash
   cd frontend
   npm run dev
   ```

2. **Access the application**
   - Open http://localhost:3000 in your browser
   - Login with any email/password (placeholder authentication)

#### Backend Development

**Option 1: Local Express Server (Recommended for Development)**

1. **Start the local development server**
   ```bash
   cd backend
   npm install
   npm run dev
   ```
   
   You should see: `🔧 Running in LOCAL MOCK MODE - AWS credentials not required`
   
   This starts an Express server on http://localhost:3001 that simulates API Gateway.

2. **The frontend is already configured** to proxy API requests to the local server via `vite.config.js`.

3. **Mock Mode Features:**
   - AI responses are generated locally (no Bedrock calls)
   - Data is stored in-memory (no DynamoDB needed)
   - All endpoints work with mock data
   - Perfect for testing and development

**Option 2: AWS SAM Local**

1. **Build the SAM application**
   ```bash
   cd backend
   sam build
   ```

2. **Test locally with SAM Local**
   ```bash
   sam local start-api
   ```

3. **Update frontend API endpoint**
   - Update `VITE_API_BASE_URL` in `.env` to point to your local API
   - Or use the proxy configured in `vite.config.js` (default: http://localhost:3001)

## 📦 Deployment

### Backend Deployment (AWS)

1. **Build the SAM application**
   ```bash
   cd backend
   sam build
   ```

2. **Deploy to AWS**
   ```bash
   sam deploy --guided
   ```
   
   Follow the prompts to:
   - Set stack name: `ai-automation-suite`
   - Select AWS region
   - Confirm IAM role creation
   - Save configuration to `samconfig.toml`

3. **Note the API Gateway URL**
   - After deployment, SAM will output the API Gateway URL
   - Copy this URL for frontend configuration

4. **Enable Bedrock Access**
   - Ensure your AWS account has access to Bedrock models
   - Request access in AWS Bedrock console if needed
   - Update IAM roles to allow Bedrock invocation

### Frontend Deployment

#### Option 1: AWS Amplify (Recommended)

1. **Install Amplify CLI**
   ```bash
   npm install -g @aws-amplify/cli
   ```

2. **Initialize Amplify**
   ```bash
   cd frontend
   amplify init
   ```

3. **Add hosting**
   ```bash
   amplify add hosting
   ```

4. **Deploy**
   ```bash
   amplify publish
   ```

#### Option 2: AWS S3 + CloudFront

1. **Build the frontend**
   ```bash
   cd frontend
   npm run build
   ```

2. **Upload to S3**
   ```bash
   aws s3 sync dist/ s3://your-bucket-name --delete
   ```

3. **Configure CloudFront**
   - Create a CloudFront distribution pointing to your S3 bucket
   - Set up custom domain (optional)

4. **Update environment variables**
   - Set `VITE_API_BASE_URL` to your API Gateway URL
   - Rebuild and redeploy

### Post-Deployment Configuration

1. **Update API Gateway CORS** (if needed)
   - Ensure CORS is enabled for your frontend domain
   - Update `Access-Control-Allow-Origin` headers in Lambda functions

2. **Configure API Keys**
   - Update API keys in the Admin Panel
   - Or set them as environment variables in Lambda

3. **Test the deployment**
   - Access the frontend URL
   - Test each agent functionality
   - Verify DynamoDB tables are created

## 🧩 Features

### 1. Customer Support Agent

- **Chat Interface**: Real-time chat with AI support agent
- **Ticket Triage**: Automatically categorizes and prioritizes tickets
- **CRM Integration**: Creates tickets in CRM system
- **Human Escalation**: Escalates to human agents when confidence is low
- **Confidence Scoring**: Displays AI confidence for each response

### 2. Data Analytics Agent

- **Data Dashboard**: Visualizes CRM metrics and KPIs
- **AI Analysis**: Generates insights using AWS Bedrock
- **Export Options**: Download reports as text or send to Slack
- **Real-time Updates**: Fetches latest data from CRM

### 3. Marketing Automation Agent

- **Post Scheduling**: Schedule posts for Facebook, LinkedIn, Twitter
- **AI Content Generation**: Generate post suggestions using AI
- **Engagement Tracking**: Visualize engagement metrics with charts
- **Recommendations**: Get AI-powered next-week marketing plan

### 4. Admin Configuration Panel

- **Model Settings**: Configure temperature and confidence thresholds
- **API Configuration**: Manage API keys and endpoints
- **Report Settings**: Set default report formats
- **Auto-save**: Changes automatically saved to DynamoDB

## 🔧 Configuration

### Environment Variables

**For Local Development (Mock Mode):**
- No environment variables required! Just run `npm start` and `npm run dev:backend`
- The app automatically detects missing AWS credentials and uses mock mode
- You can optionally set `USE_MOCK_MODE=true` to force mock mode

**For AWS Deployment:**
Key environment variables (see `env.example` for full list):

- `AWS_REGION`: AWS region for deployment
- `AWS_ACCESS_KEY_ID`: AWS access key (leave empty for mock mode)
- `AWS_SECRET_ACCESS_KEY`: AWS secret key (leave empty for mock mode)
- `BEDROCK_MODEL_ID`: Bedrock model to use (e.g., `anthropic.claude-v2`)
- `MODEL_TEMPERATURE`: AI model temperature (0-1)
- `CONFIDENCE_THRESHOLD`: Minimum confidence for auto-resolution (0-1)
- `CRM_ENDPOINT_URL`: CRM API endpoint
- `SLACK_WEBHOOK_URL`: Slack webhook for exports

### Mock Mode

When running in mock mode (no AWS credentials):
- **AI Responses**: Generated locally using mock Bedrock service
- **Data Storage**: In-memory storage (resets on server restart)
- **CRM Integration**: Mock responses (no actual API calls)
- **Social Media**: Mock post scheduling (no actual posts sent)

Mock responses include:
- Support Agent: Contextual help responses
- Analytics Agent: Sample insights and recommendations
- Marketing Agent: Generated post suggestions and marketing plans

### DynamoDB Tables

Three DynamoDB tables are automatically created:

1. **SupportTickets**: Stores customer support tickets
2. **MarketingPosts**: Stores scheduled social media posts
3. **SystemConfig**: Stores system configuration

See `config/dynamodb-schema.json` for detailed schema.

## 🔐 Security Considerations

1. **API Keys**: Store sensitive keys in AWS Secrets Manager or Parameter Store
2. **IAM Roles**: Use least-privilege IAM policies
3. **CORS**: Configure CORS appropriately for production
4. **Authentication**: Implement proper authentication (currently placeholder)
5. **Encryption**: Enable encryption at rest for DynamoDB tables

## 🧪 Testing

### Frontend Testing

```bash
cd frontend
npm run test  # If test framework is added
```

### Backend Testing

```bash
cd backend
sam local invoke SupportChatFunction --event events/support-chat-event.json
```

## 📝 API Endpoints

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

## 🐛 Troubleshooting

### Common Issues

1. **Bedrock Access Denied**
   - Ensure Bedrock access is enabled in your AWS account
   - Check IAM role permissions

2. **CORS Errors**
   - Verify API Gateway CORS configuration
   - Check Lambda function response headers

3. **DynamoDB Errors**
   - Ensure tables are created (check CloudFormation stack)
   - Verify IAM permissions for DynamoDB

4. **Frontend API Errors**
   - Check `VITE_API_BASE_URL` in environment variables
   - Verify API Gateway URL is correct

## 📚 Additional Resources

- [AWS Bedrock Documentation](https://docs.aws.amazon.com/bedrock/)
- [AWS SAM Documentation](https://docs.aws.amazon.com/serverless-application-model/)
- [React Documentation](https://react.dev/)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

## 📄 License

MIT License - see LICENSE file for details

## 👥 Support

For issues and questions:
- Open an issue on GitHub
- Contact the development team

---

**Built with ❤️ for AI consulting agencies**

