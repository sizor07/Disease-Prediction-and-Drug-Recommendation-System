# Quick Django Setup Script for Windows PowerShell
# Usage: .\setup.ps1

Write-Host "=====================================" -ForegroundColor Cyan
Write-Host "Django Health Project Setup Script" -ForegroundColor Cyan
Write-Host "=====================================" -ForegroundColor Cyan
Write-Host ""

# Check Python installation
Write-Host "Checking Python installation..." -ForegroundColor Yellow
python --version
if ($LASTEXITCODE -ne 0) {
    Write-Host "Python not found! Please install Python 3.8+" -ForegroundColor Red
    exit 1
}

# Install dependencies
Write-Host "`nInstalling dependencies..." -ForegroundColor Yellow
pip install -r requirements.txt
if ($LASTEXITCODE -ne 0) {
    Write-Host "Failed to install dependencies" -ForegroundColor Red
    exit 1
}

# Make migrations
Write-Host "`nCreating database migrations..." -ForegroundColor Yellow
python manage.py makemigrations
if ($LASTEXITCODE -ne 0) {
    Write-Host "Failed to create migrations" -ForegroundColor Red
    exit 1
}

# Run migrations
Write-Host "`nApplying database migrations..." -ForegroundColor Yellow
python manage.py migrate
if ($LASTEXITCODE -ne 0) {
    Write-Host "Failed to apply migrations" -ForegroundColor Red
    exit 1
}

# Load data
Write-Host "`nLoading medical data from CSV..." -ForegroundColor Yellow
python manage.py load_medical_data
if ($LASTEXITCODE -ne 0) {
    Write-Host "Warning: Failed to load CSV data. Check your CSV file path." -ForegroundColor Yellow
}

Write-Host "`n=====================================" -ForegroundColor Green
Write-Host "✓ Setup Complete!" -ForegroundColor Green
Write-Host "=====================================" -ForegroundColor Green
Write-Host ""
Write-Host "Next steps:" -ForegroundColor Cyan
Write-Host "1. Create superuser: python manage.py createsuperuser" -ForegroundColor White
Write-Host "2. Run server: python manage.py runserver" -ForegroundColor White
Write-Host "3. Visit admin: http://localhost:8000/admin" -ForegroundColor White
Write-Host ""
