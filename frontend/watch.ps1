# Watch script for automatic rebuild on file changes
$srcPath = "C:\Users\Gamer\Documents\Reciclaje\frontend\src"
$lastHash = @{}

Write-Host "Watching for changes in $srcPath..." -ForegroundColor Green
Write-Host "Press Ctrl+C to stop" -ForegroundColor Yellow

while ($true) {
    Get-ChildItem -Path $srcPath -Recurse -Filter "*.tsx" -o -Filter "*.ts" -o -Filter "*.css" | ForEach-Object {
        $hash = (Get-FileHash $_.FullName).Hash
        if ($lastHash[$_.FullName] -ne $hash) {
            $lastHash[$_.FullName] = $hash
            Write-Host "[$(Get-Date -Format 'HH:mm:ss')] Changed: $($_.Name)"
            Write-Host "Running: npm run build" -ForegroundColor Cyan
            npm run build
            Write-Host "✓ Build complete. Refresh browser!" -ForegroundColor Green
        }
    }
    Start-Sleep -Milliseconds 500
}
