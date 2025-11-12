# Remove API Key from Git History

## Problem
GitHub detected an API key in commit `e868d44` and is blocking the push.

## Solution Options

### Option 1: Allow Secret in GitHub (Quick Fix)
1. Visit this URL: https://github.com/sohel369/AI-Agents-for-Agency-Operations/security/secret-scanning/unblock-secret/35Mgu3QaPYiMkVgtaJ7kA2aWex4
2. Click "Allow secret" (if you want to keep it temporarily)
3. Then push again

**⚠️ Warning**: This allows the secret to remain in your repository history. Not recommended for production.

### Option 2: Rewrite Git History (Recommended)
Remove the API key from all commits:

```bash
# Method 1: Interactive Rebase (Manual)
git rebase -i e868d44^
# In the editor, change 'pick' to 'edit' for commit e868d44
# Then edit the files to remove the API key
git add .
git commit --amend --no-edit
git rebase --continue

# Method 2: Use git filter-branch (Automated)
git filter-branch --force --index-filter \
  "git rm --cached --ignore-unmatch GOOGLE_AI_SETUP.md backend/src/admin/config.js" \
  --prune-empty --tag-name-filter cat -- --all

# Method 3: Use BFG Repo-Cleaner (Fastest)
# Download BFG: https://rtyley.github.io/bfg-repo-cleaner/
java -jar bfg.jar --replace-text passwords.txt
git reflog expire --expire=now --all && git gc --prune=now --aggressive
```

### Option 3: Create New Branch (Easiest)
If the problematic commit is recent:

```bash
# Create a new branch from before the problematic commit
git checkout -b main-clean 691af50
# Cherry-pick the good commits
git cherry-pick 3f1e5c3
# Force push the new branch
git push origin main-clean:main --force
```

## Current Status
✅ API keys removed from current files:
- GOOGLE_AI_SETUP.md
- backend/src/admin/config.js  
- frontend/src/pages/AdminPanel.jsx

❌ API key still exists in commit history (commit e868d44)

## Recommended Action
Use Option 1 (allow secret) for now, then:
1. Rotate/revoke the exposed API key
2. Get a new API key
3. Add it to environment variables (not in code)

