# Deployment Checklist

Use this checklist to ensure a smooth deployment of the AI Automation Suite.

## Pre-Deployment

### AWS Account Setup
- [ ] AWS CLI installed and configured
- [ ] AWS SAM CLI installed (`sam --version`)
- [ ] AWS account has appropriate permissions
- [ ] AWS Bedrock access enabled (request in AWS Console if needed)
- [ ] IAM user/role with deployment permissions

### Environment Configuration
- [ ] Copy `env.example` to `.env`
- [ ] Update all environment variables in `.env`
- [ ] Verify AWS region is correct
- [ ] Set Bedrock model ID
- [ ] Configure API keys (CRM, Slack, Social Media)
- [ ] Set confidence threshold and temperature

### Code Review
- [ ] All dependencies installed (`npm run install:all`)
- [ ] Frontend builds successfully (`cd frontend && npm run build`)
- [ ] Backend builds successfully (`cd backend && sam build`)
- [ ] Local testing completed
- [ ] No console errors or warnings

## Backend Deployment

### Step 1: Build
```bash
cd backend
sam build
```

- [ ] Build completes without errors
- [ ] All Lambda functions compiled
- [ ] Dependencies resolved

### Step 2: Validate Template
```bash
sam validate
```

- [ ] Template validation passes
- [ ] No syntax errors in `template.yaml`

### Step 3: Deploy
```bash
sam deploy --guided
```

**Configuration Prompts:**
- [ ] Stack name: `ai-automation-suite`
- [ ] AWS Region: (e.g., `us-east-1`)
- [ ] Confirm IAM role creation: `Y`
- [ ] Allow SAM CLI to create IAM roles: `Y`
- [ ] Save arguments to `samconfig.toml`: `Y`

- [ ] Deployment completes successfully
- [ ] API Gateway URL noted
- [ ] DynamoDB tables created
- [ ] Lambda functions deployed

### Step 4: Verify Backend
- [ ] Test API Gateway endpoints
- [ ] Verify DynamoDB tables exist
- [ ] Check Lambda function logs
- [ ] Test Bedrock integration (if configured)

## Frontend Deployment

### Option 1: AWS Amplify

#### Step 1: Initialize Amplify
```bash
cd frontend
amplify init
```

- [ ] Project initialized
- [ ] Environment configured

#### Step 2: Add Hosting
```bash
amplify add hosting
```

- [ ] Hosting added
- [ ] Build settings configured

#### Step 3: Configure Environment
- [ ] Update `VITE_API_BASE_URL` to API Gateway URL
- [ ] Rebuild frontend: `npm run build`

#### Step 4: Deploy
```bash
amplify publish
```

- [ ] Deployment successful
- [ ] Frontend URL noted

### Option 2: S3 + CloudFront

#### Step 1: Create S3 Bucket
```bash
aws s3 mb s3://your-bucket-name --region us-east-1
```

- [ ] Bucket created
- [ ] Static website hosting enabled

#### Step 2: Build Frontend
```bash
cd frontend
# Update VITE_API_BASE_URL in .env
npm run build
```

- [ ] Build successful
- [ ] `dist/` folder created

#### Step 3: Upload to S3
```bash
aws s3 sync dist/ s3://your-bucket-name --delete
```

- [ ] Files uploaded
- [ ] Bucket policy configured for public read

#### Step 4: Configure CloudFront (Optional)
- [ ] CloudFront distribution created
- [ ] S3 bucket as origin
- [ ] Custom domain configured (optional)
- [ ] SSL certificate configured

## Post-Deployment

### Configuration
- [ ] Update CORS settings in API Gateway
- [ ] Configure API keys in Admin Panel
- [ ] Test authentication flow
- [ ] Verify environment variables in Lambda

### Testing
- [ ] Test Customer Support Agent
- [ ] Test Data Analytics Agent
- [ ] Test Marketing Automation Agent
- [ ] Test Admin Panel configuration
- [ ] Verify DynamoDB data persistence
- [ ] Test Bedrock AI responses (if configured)

### Monitoring
- [ ] CloudWatch logs configured
- [ ] Error tracking set up
- [ ] Performance monitoring enabled
- [ ] Cost alerts configured

### Security
- [ ] API keys stored in Secrets Manager (recommended)
- [ ] IAM roles follow least privilege
- [ ] CORS properly configured
- [ ] HTTPS enabled (CloudFront/Amplify)
- [ ] Authentication implemented (replace placeholder)

### Documentation
- [ ] API Gateway URL documented
- [ ] Frontend URL documented
- [ ] Environment variables documented
- [ ] Team access configured

## Rollback Plan

If deployment fails:

1. **Backend Rollback**
   ```bash
   aws cloudformation delete-stack --stack-name ai-automation-suite
   ```

2. **Frontend Rollback**
   - Revert to previous Amplify deployment
   - Or restore previous S3 version

3. **Verify Cleanup**
   - Check DynamoDB tables
   - Verify Lambda functions deleted
   - Confirm no orphaned resources

## Troubleshooting

### Common Issues

**Bedrock Access Denied**
- Enable Bedrock in AWS Console
- Check IAM role permissions
- Verify model ID is correct

**CORS Errors**
- Update API Gateway CORS settings
- Check Lambda response headers
- Verify frontend URL in CORS config

**DynamoDB Errors**
- Verify tables created in CloudFormation
- Check IAM permissions
- Verify table names match environment variables

**Lambda Timeout**
- Increase timeout in `template.yaml`
- Check function logs in CloudWatch
- Optimize code if needed

## Support

For deployment issues:
1. Check CloudWatch logs
2. Review CloudFormation stack events
3. Verify IAM permissions
4. Check AWS service quotas

---

**Last Updated:** 2024-01-15

