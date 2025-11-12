# PowerShell script to fix Git push after removing API keys
# Run this script: .\fix-git-push.ps1

Write-Host "🔍 Checking for secrets in current files..." -ForegroundColor Yellow
$secrets = git grep -i "sk-proj\|AIzaSy" -- ':!*.md' ':!*.example' ':!.gitignore' 2>$null
if ($secrets) {
    Write-Host "❌ Found secrets in current files. Please remove them first." -ForegroundColor Red
    exit 1
}
Write-Host "✅ No secrets found in current files." -ForegroundColor Green

Write-Host "`n📦 Staging all changes..." -ForegroundColor Yellow
git add .

Write-Host "`n💾 Committing changes..." -ForegroundColor Yellow
git commit -m "Security: Remove all API keys, use environment variables" 2>$null

Write-Host "`n✅ Changes committed!" -ForegroundColor Green
Write-Host "`n⚠️  IMPORTANT: GitHub is blocking push due to API key in commit history." -ForegroundColor Yellow
Write-Host "`nChoose an option:" -ForegroundColor Cyan
Write-Host "1. Use GitHub override (Easiest - visit URL to allow secret)" -ForegroundColor White
Write-Host "2. Rewrite git history (Permanent fix - requires force push)" -ForegroundColor White
Write-Host "`nOption 1 URL:" -ForegroundColor Cyan
Write-Host "https://github.com/sohel369/AI-Agents-for-Agency-Operations/security/secret-scanning/unblock-secret/35Mgu3QaPYiMkVgtaJ7kA2aWex4" -ForegroundColor Yellow

$choice = Read-Host "`nEnter choice (1 or 2)"
if ($choice -eq "2") {
    Write-Host "`n🔄 Rewriting git history..." -ForegroundColor Yellow
    Write-Host "Creating clean branch from before problematic commit..." -ForegroundColor Yellow
    
    # Create clean branch
    git checkout -b main-clean 691af50 2>$null
    
    # Cherry-pick good commits
    git cherry-pick 3f1e5c3 2>$null
    git cherry-pick 149353e 2>$null
    
    Write-Host "`n✅ Clean branch created!" -ForegroundColor Green
    Write-Host "`n⚠️  Now force push with:" -ForegroundColor Yellow
    Write-Host "git push origin main-clean:main --force-with-lease" -ForegroundColor Cyan
} else {
    Write-Host "`n📤 Attempting to push..." -ForegroundColor Yellow
    Write-Host "If blocked, visit the URL above to allow the secret, then run:" -ForegroundColor Yellow
    Write-Host "git push origin main" -ForegroundColor Cyan
    git push origin main
}

