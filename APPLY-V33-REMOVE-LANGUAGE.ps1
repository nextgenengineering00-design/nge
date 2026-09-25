$ErrorActionPreference = "SilentlyContinue"
Remove-Item ".\components\localized-site-page.tsx" -Force
Remove-Item ".\lib\static-i18n.ts" -Force
Remove-Item ".\lib\static-i18n-data.json" -Force
Remove-Item ".\public\legacy\language-route-switcher.js" -Force
Remove-Item ".\public\legacy\language-switcher.js" -Force
Remove-Item ".\app\en" -Recurse -Force
Remove-Item ".\app\zh" -Recurse -Force
Remove-Item ".\.next" -Recurse -Force
Remove-Item ".\dist" -Recurse -Force
Write-Host "Removed all NGE language-switching files and old build cache."
