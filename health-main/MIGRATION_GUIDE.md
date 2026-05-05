# Django Database Migration Guide

## Complete Setup & Data Migration Steps

### Prerequisites
- Python 3.8+
- pip
- Your project files in place

---

## Step 1: Install Dependencies

```powershell
cd c:\Users\VICTUS\Downloads\health-main\health-main
pip install -r requirements.txt
```

**Dependencies installed:**
- Django 4.2.11
- Django REST Framework
- django-cors-headers
- pandas (for CSV loading)
- scikit-learn, joblib (ML models)
- Pillow (image handling)
- fuzzywuzzy (string matching)

---

## Step 2: Initialize Database

### Create Initial Migrations
```powershell
python manage.py makemigrations
```
**Output:** Creates migration files for User, Medical, Ment, Profile models

### Run Migrations
```powershell
python manage.py migrate
```
**Output:** Creates db.sqlite3 with all tables

### Verify Database
```powershell
python manage.py dbshell
.tables
```

---

## Step 3: Create Admin User

```powershell
python manage.py createsuperuser
```

**Prompts:**
- Username: `admin`
- Email: `admin@localhost`
- Password: (create a password)

---

## Step 4: Load CSV Data

### Option A: Load with Default Settings
```powershell
python manage.py load_medical_data
```

Loads from: `symptom-disease-drug.csv` in current directory

### Option B: Specify Custom CSV Path
```powershell
python manage.py load_medical_data --csv_path "C:\path\to\your\file.csv"
```

### Option C: Clear Existing Data First
```powershell
python manage.py load_medical_data --clear
```

**What happens:**
1. Reads CSV file using pandas
2. Creates system doctor & patient users (if not exist)
3. Bulk inserts data into Medical table (batch size: 1000)
4. Shows progress and any errors

**Expected Output:**
```
Loaded CSV with 4920 rows
Created system doctor user
Created system patient user
  Inserted 1000 records (row 1001/4920)
  Inserted 1000 records (row 2001/4920)
  Inserted 1000 records (row 3001/4920)
  Inserted 1000 records (row 4001/4920)
  Inserted 920 remaining records

✓ Successfully loaded 4920 medical records into database
```

---

## Step 5: Verify Data Load

### Check Database Records
```powershell
python manage.py shell
```

Then in Django shell:
```python
from core.models import Medical, User
print(f"Total Medical Records: {Medical.objects.count()}")
print(f"System Doctor: {User.objects.filter(is_doctor=True).first()}")
print(f"Sample Disease: {Medical.objects.first().disease}")
```

### View in Admin Panel
```powershell
python manage.py runserver
```

Then visit: **http://localhost:8000/admin**
- Login with your superuser credentials
- View Medical, User, Ment, Profile tables

---

## Step 6: Run Development Server

```powershell
python manage.py runserver
```

**Access Points:**
- Home: `http://localhost:8000/`
- Admin: `http://localhost:8000/admin/`
- API: `http://localhost:8000/api/`

---

## Switching to PostgreSQL (Production)

### 1. Install PostgreSQL Driver
```powershell
pip install psycopg2-binary
```

### 2. Create `.env` File
```bash
DB_ENGINE=django.db.backends.postgresql
DB_NAME=health_db
DB_USER=postgres
DB_PASSWORD=your_password
DB_HOST=localhost
DB_PORT=5432
```

### 3. Update settings.py (Already Done)
The PostgreSQL configuration is already in `health_project/settings.py` but commented out.
Uncomment and update with your credentials.

### 4. Create PostgreSQL Database
```sql
CREATE DATABASE health_db;
CREATE USER postgres WITH PASSWORD 'your_password';
ALTER ROLE postgres SET client_encoding TO 'utf8';
ALTER ROLE postgres SET default_transaction_isolation TO 'read committed';
ALTER ROLE postgres SET default_transaction_deferrable TO ON;
ALTER ROLE postgres SET default_transaction_level TO 'read committed';
GRANT ALL PRIVILEGES ON DATABASE health_db TO postgres;
```

### 5. Run Migrations on PostgreSQL
```powershell
python manage.py migrate
python manage.py load_medical_data
```

---

## Project Structure After Setup

```
health-main/
├── db.sqlite3                          # SQLite database
├── manage.py                           # Django CLI
├── requirements.txt                    # Dependencies
├── health_project/
│   ├── settings.py                     # DB & app config
│   ├── urls.py                         # URL routing
│   ├── wsgi.py                         # Production
│   └── asgi.py                         # Async support
├── core/
│   ├── models.py                       # User, Medical, Ment, Profile
│   ├── views.py                        # Request handlers
│   ├── serializers.py                  # REST API serializers
│   ├── urls.py                         # API endpoints
│   ├── admin.py                        # Admin interface
│   ├── management/
│   │   └── commands/
│   │       └── load_medical_data.py    # CSV loader command
│   ├── migrations/                     # DB versions
│   ├── templates/                      # HTML files
│   └── static/                         # CSS, JS, images
├── symptom-disease-drug.csv            # Data source
├── Training.csv                        # ML training data
├── Testing.csv                         # ML test data
└── disease_prediction_model.joblib     # ML model
```

---

## Troubleshooting

### Error: "No such table: core_user"
**Solution:** Run migrations
```powershell
python manage.py migrate
```

### Error: "CSV file not found"
**Solution:** Use full path or ensure file is in current directory
```powershell
python manage.py load_medical_data --csv_path "full\path\to\symptom-disease-drug.csv"
```

### Error: "ModuleNotFoundError: No module named 'django'"
**Solution:** Install requirements
```powershell
pip install -r requirements.txt
```

### Error: "OperationalError: no such table"
**Solution:** Clear and remake migrations
```powershell
rm db.sqlite3
python manage.py makemigrations
python manage.py migrate
```

### Slow Data Load on Large CSV
**Solution:** CSV loader already uses batch processing (1000 records at a time).
For better performance with >10,000 rows, consider using PostgreSQL.

---

## Next Steps

1. ✅ Django setup complete
2. ✅ Database configured
3. ✅ CSV data migrated
4. ⬜ Create REST API endpoints
5. ⬜ Connect React frontend
6. ⬜ Add authentication (JWT)
7. ⬜ Deploy to production

---

## Quick Reference Commands

```powershell
# Setup
pip install -r requirements.txt
python manage.py makemigrations
python manage.py migrate

# Admin
python manage.py createsuperuser

# Data
python manage.py load_medical_data
python manage.py load_medical_data --clear

# Development
python manage.py runserver
python manage.py shell

# Production
gunicorn health_project.wsgi
```

---

## Database Models Overview

### User
- Custom user extending Django's AbstractUser
- Fields: username, email, is_patient, is_doctor, phonenumber
- Relations: One-to-Many with Medical, Ment, Profile

### Medical
- Records patient diagnoses
- Fields: s1-s5 (symptoms), disease, medicine, patient, doctor
- Links to: User (patient), User (doctor)

### Ment
- Appointment/Mental health records
- Fields: approved, time, patient, doctor, ment_day, medical
- Links to: User (patient), User (doctor), Medical

### Profile
- User profile information
- Fields: user, avatar, birth_date, region, gender, country
- Links to: User (One-to-One)

---

**Setup Complete!** 🎉

Your Django project is now ready with:
- ✅ Database configured
- ✅ Models created
- ✅ CSV data loaded
- ✅ Admin interface
- ✅ REST serializers
