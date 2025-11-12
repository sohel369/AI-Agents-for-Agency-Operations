# Vercel Deployment Fix Guide

## Issue
Vercel build error: "Cannot find package '@vitejs/plugin-react'"

## Solution

The package is already in `package.json` devDependencies. The issue is likely that:
1. Vercel needs to install dependencies properly
2. Build settings need to be configured correctly

## Step-by-Step Fix

### 1. Verify Package is in package.json ✅
The package is already present in `frontend/package.json`:
```json
"devDependencies": {
  "@vitejs/plugin-react": "^4.2.1",
  ...
}
```

### 2. Install Dependencies Locally
```bash
cd frontend
npm install
```

### 3. Verify Local Build Works
```bash
npm run build
```

### 4. Vercel Configuration

#### Option A: Using Vercel Dashboard
1. Go to your Vercel project settings
2. Navigate to **Settings** → **General**
3. Set **Root Directory** to `frontend` (if deploying only frontend)
4. Go to **Settings** → **Build & Development Settings**
5. Set:
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
   - **Install Command**: `npm install`

#### Option B: Create vercel.json (Recommended)
Create `vercel.json` in the **root** of your repository:

```json
{
  "buildCommand": "cd frontend && npm install && npm run build",
  "outputDirectory": "frontend/dist",
  "installCommand": "cd frontend && npm install",
  "framework": "vite",
  "devCommand": "cd frontend && npm run dev"
}
```

Or if deploying from `frontend` directory:

```json
{
  "buildCommand": "npm run build",
  "outputDirectory": "dist",
  "installCommand": "npm install",
  "framework": "vite"
}
```

### 5. Ensure package-lock.json is Committed
```bash
cd frontend
git add package-lock.json
git commit -m "chore: ensure package-lock.json is committed for Vercel"
```

### 6. Commit and Push
```bash
git add .
git commit -m "fix: ensure @vitejs/plugin-react is properly configured for Vercel"
git push origin main
```

### 7. Vercel Environment Variables (if needed)
If you have environment variables, add them in:
- Vercel Dashboard → Settings → Environment Variables

## Troubleshooting

### If build still fails:

1. **Clear Vercel Build Cache**:
   - Vercel Dashboard → Settings → General → Clear Build Cache

2. **Check Node Version**:
   - Ensure Vercel uses Node.js 18+ (check in Settings → General → Node.js Version)

3. **Verify Build Logs**:
   - Check Vercel build logs for specific error messages
   - Look for "npm install" output to see if devDependencies are installed

4. **Force Reinstall**:
   - Add to `package.json` scripts:
   ```json
   "vercel-build": "npm install && npm run build"
   ```
   - Then set Build Command to: `npm run vercel-build`

## Quick Commands Summary

```bash
# 1. Navigate to frontend
cd frontend

# 2. Install dependencies
npm install

# 3. Test build locally
npm run build

# 4. Commit changes
git add .
git commit -m "fix: configure Vercel build settings"
git push origin main
```

## Verification Checklist

- [x] `@vitejs/plugin-react` is in `devDependencies`
- [x] `package-lock.json` is committed
- [x] Local build works (`npm run build`)
- [ ] `vercel.json` is created (if needed)
- [ ] Vercel project settings are configured
- [ ] Build command is set correctly
- [ ] Output directory is set to `dist`

## Additional Notes

- Vercel automatically installs dependencies including devDependencies for builds
- The `@vitejs/plugin-react` package is required for Vite to process React/JSX files
- If deploying monorepo, ensure root directory is set correctly in Vercel settings

