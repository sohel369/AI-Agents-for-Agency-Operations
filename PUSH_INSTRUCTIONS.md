# 🚀 Safe Push Instructions

## Current Situation
- ✅ All API keys removed from source code
- ✅ Code uses `process.env` for secrets
- ✅ `.env.example` files created
- ⚠️ Old commit `e868d44` still contains API key in history

## 🎯 Recommended: Quick Push (Use GitHub Override)

### Step 1: Commit Current Changes
```bash
git add .
git commit -m "Security: Complete removal of API keys, use environment variables"
```

### Step 2: Use GitHub's Temporary Override
1. Visit: https://github.com/sohel369/AI-Agents-for-Agency-Operations/security/secret-scanning/unblock-secret/35Mgu3QaPYiMkVgtaJ7kA2aWex4
2. Click **"Allow secret"** (this is a one-time override)
3. Immediately push:
   ```bash
   git push origin main
   ```

### Step 3: After Push - Rotate Keys
**IMPORTANT**: The exposed key is now in your Git history. You MUST:
1. Go to https://aistudio.google.com/app/apikey
2. **Revoke** the old API key
3. Create a **new** API key
4. Update your local `.env` file with the new key

## 🔄 Alternative: Clean History (Permanent Fix)

If you want to permanently remove the secret from history:

```bash
# Method 1: Create clean branch (Safest)
git checkout -b main-clean 691af50
git cherry-pick 3f1e5c3 149353e
git push origin main-clean:main --force-with-lease

# Method 2: Interactive rebase
git rebase -i e868d44^
# Change 'pick' to 'edit' for e868d44
# Then: git add . && git commit --amend --no-edit
# Then: git rebase --continue
# Finally: git push origin main --force-with-lease
```

## ✅ Verification Before Push

```bash
# Check no secrets in current files
git grep -i "sk-proj\|AIzaSy" -- ':!*.md' ':!*.example' ':!.gitignore' || echo "✅ No secrets found"

# Verify .env is ignored
git check-ignore .env backend/.env frontend/.env && echo "✅ .env files are ignored"
```

## 📝 Next Steps After Push

1. **Create local .env files:**
   ```bash
   cd backend && cp .env.example .env
   cd ../frontend && cp .env.example .env
   ```

2. **Add your API keys to backend/.env:**
   ```bash
   GOOGLE_AI_API_KEY=your-new-key-here
   DEMO_MODE=true
   ```

3. **Test locally:**
   ```bash
   cd backend && npm run dev
   cd ../frontend && npm run dev
   ```

## 🔐 For Production Deployment

### Vercel:
- Add environment variables in Vercel Dashboard → Settings → Environment Variables

### GitHub Actions:
- Add secrets in: Settings → Secrets and variables → Actions

### AWS Lambda:
- Use AWS Systems Manager Parameter Store or Secrets Manager

