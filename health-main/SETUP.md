# Django Project Setup Guide

## New Project Structure Created

```
health-main/
├── manage.py                    # Django management script
├── health_project/              # Project configuration
│   ├── __init__.py
│   ├── settings.py             # Django settings
│   ├── urls.py                 # Main URL routing
│   ├── wsgi.py                 # WSGI application
│   └── asgi.py                 # ASGI application
├── core/                       # Main app
│   ├── models.py              # Database models (User, Medical, Ment, Profile)
│   ├── views.py               # View logic
│   ├── admin.py               # Django admin configuration
│   ├── urls.py                # App-level URL routing
│   ├── migrations/            # Database migrations
│   ├── templates/             # HTML templates
│   └── static/                # CSS, JS, Images
├── requirements.txt           # Python dependencies
├── db.sqlite3                 # SQLite database (auto-created)
└── .env.example               # Environment variables template
```

## Quick Start

### 1. Install Dependencies
```bash
pip install -r requirements.txt
```

### 2. Run Migrations
```bash
python manage.py makemigrations
python manage.py migrate
```

### 3. Create Superuser (Admin)
```bash
python manage.py createsuperuser
```

### 4. Load Data from CSV
Create a data migration or use a management command to load your symptom-disease-drug data:
```bash
python manage.py load_medical_data
```

### 5. Run Development Server
```bash
python manage.py runserver
```

Access at: `http://localhost:8000`

## Key Files Created/Updated

- **manage.py**: Django command-line tool
- **health_project/settings.py**: Database, installed apps, middleware configuration
- **health_project/urls.py**: Main URL routing (delegates to core app)
- **health_project/wsgi.py**: Production server configuration
- **core/admin.py**: Enhanced Django admin interface
- **requirements.txt**: Added Django, DRF, CORS, PostgreSQL support

## Database Options

### SQLite (Default - Development)
Already configured in `settings.py`. Best for development.

### PostgreSQL (Production)
Uncomment the PostgreSQL section in `settings.py` and set environment variables:
```bash
DB_NAME=health_db
DB_USER=postgres
DB_PASSWORD=your_password
DB_HOST=localhost
DB_PORT=5432
```

## Django Admin Panel

After creating a superuser:
- URL: `http://localhost:8000/admin`
- Manage Users, Medical records, Appointments, Profiles

## API Endpoints

Routes defined in `core/urls.py`:
- `/api/` - Main API prefix
- `/api/predict` - Disease prediction
- `/api/patient/` - Patient endpoints
- `/api/doctor/` - Doctor endpoints

## Next Steps

1. Load your CSV data into the database
2. Update Django REST Framework serializers for API
3. Configure frontend (React) to use new API endpoints
4. Set up proper authentication (JWT tokens recommended)
5. Deploy to production (Render, Heroku, AWS, etc.)
