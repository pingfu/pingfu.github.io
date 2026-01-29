docker compose down 2>$null
docker compose up -d

Write-Host "Site is available at http://localhost:4000/"
Write-Host "Press Ctrl+C to stop..."
Write-Host ""

docker compose logs -f
