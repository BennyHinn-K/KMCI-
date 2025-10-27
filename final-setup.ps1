$headers = @{
    "apikey" = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJ4dGl3Z2Z3eHF2enNjcWJnbnFrIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2MDMyODAyNCwiZXhwIjoyMDc1OTA0MDI0fQ.RWYvwc5SC7lSDXvxwsqlF3i5poHii4NJg3N6NF9w7IA"
    "Authorization" = "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJ4dGl3Z2Z3eHF2enNjcWJnbnFrIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2MDMyODAyNCwiZXhwIjoyMDc1OTA0MDI0fQ.RWYvwc5SC7lSDXvxwsqlF3i5poHii4NJg3N6NF9w7IA"
    "Content-Type" = "application/json"
}

$sql = Get-Content "scripts/00-complete-setup.sql" -Raw -Encoding UTF8
$body = @{ query = $sql } | ConvertTo-Json -Depth 10

try {
    Invoke-RestMethod -Uri "https://rxtiwgfwxqvzscqbgnqk.supabase.co/rest/v1/rpc/exec_sql" -Method Post -Headers $headers -Body $body
    Write-Host "`nDATABASE SETUP COMPLETE!" -ForegroundColor Green
} catch {
    Write-Host "`nDirect SQL execution not available via API" -ForegroundColor Yellow
    Write-Host "Manual step required - SQL is in scripts/00-complete-setup.sql" -ForegroundColor Yellow
}

Write-Host "`nLogin: admin@kmci.org" -ForegroundColor Cyan
Write-Host "Password: Admin123!KMCI" -ForegroundColor Cyan
Write-Host "`nRun: npm run dev" -ForegroundColor Yellow
Write-Host "URL: http://localhost:3000/admin" -ForegroundColor Yellow
