# Quick Start Guide

Get the AI Automation Suite up and running in minutes!

## Prerequisites Check

- [ ] Node.js 18+ installed (`node --version`)
- [ ] npm installed (`npm --version`)
- [ ] AWS CLI configured (optional, for deployment)

## Step 1: Install Dependencies

```bash
# Install all dependencies
npm run install:all
```

Or install separately:
```bash
npm run install:frontend
npm run install:backend
```

## Step 2: Configure Environment (Optional - Skip for Local Dev!)

**🎉 Great News: No configuration needed for local development!**

The app automatically runs in **MOCK MODE** when AWS credentials are missing. This means:
- ✅ No AWS account needed
- ✅ No API keys required
- ✅ All features work with mock data
- ✅ Perfect for testing and development

**To use real AWS services (optional):**
```bash
cp env.example .env
# Edit .env with your AWS credentials
# Set AWS_ACCESS_KEY_ID and AWS_SECRET_ACCESS_KEY
```

## Step 3: Start Development Servers

### Terminal 1: Backend API Server
```bash
cd backend
npm run dev
```

You should see:
```
🚀 Local API server running on http://localhost:3001
```

### Terminal 2: Frontend Development Server
```bash
cd frontend
npm run dev
```

You should see:
```
VITE v5.x.x  ready in xxx ms

➜  Local:   http://localhost:3000/
```

## Step 4: Access the Application

1. Open http://localhost:3000 in your browser
2. Login with any email/password (placeholder authentication)
3. Explore the three AI agents:
   - **Customer Support Agent** - Chat with AI support
   - **Data Analytics Agent** - Analyze CRM data
   - **Marketing Automation Agent** - Schedule and manage posts

## Troubleshooting

### Port Already in Use
- Backend: Change port in `backend/local-server.js` (default: 3001)
- Frontend: Change port in `frontend/vite.config.js` (default: 3000)

### Module Not Found Errors
```bash
# Reinstall dependencies
rm -rf node_modules package-lock.json
npm install
```

### API Connection Errors
- Ensure backend server is running on port 3001
- Check browser console for CORS errors
- Verify proxy settings in `frontend/vite.config.js`

## Next Steps

- Read the full [README.md](README.md) for deployment instructions
- Configure AWS Bedrock for real AI responses
- Set up DynamoDB tables for data persistence
- Deploy to AWS using SAM

## Need Help?

- Check the [README.md](README.md) for detailed documentation
- Review the API endpoints in the README
- Check AWS SAM documentation for deployment

Happy coding! 🚀

