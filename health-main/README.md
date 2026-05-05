# Disease Prediction and Drug Recommendation System

![License](https://img.shields.io/badge/license-MIT-blue.svg)
![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)
![Django](https://img.shields.io/badge/Django-092E20?style=for-the-badge&logo=django&logoColor=white)
![Flask](https://img.shields.io/badge/Flask-000000?style=for-the-badge&logo=flask&logoColor=white)

An advanced, AI-powered medical diagnostic system that predicts diseases based on symptoms and provides verified drug recommendations. This project features a robust architecture combining a React frontend, a Django management backend, and a Flask-based Machine Learning engine.

---

## 🚀 Key Features

- **AI-Driven Diagnosis**: Leverages a Random Forest model to predict 40+ diseases with high accuracy.
- **Drug Recommendations**: Provides specific drug suggestions for each predicted condition using fuzzy matching.
- **Dual Dashboard System**:
  - **Doctor Dashboard**: Manage appointment requests, review patient diagnoses, and approve recommendations.
  - **Patient Dashboard**: Track medical history, request appointments, and manage profile data.
- **Real-time Interaction**: Fully interactive sidebar and navigation system for a seamless user experience.
- **Firebase Integration**: Secure authentication and real-time database storage for patient records.

---

## 🛠️ Technology Stack

### Frontend
- **React.js**: Modern UI with material-style components.
- **Material UI & React Bootstrap**: For sleek, responsive design.
- **Firebase Auth**: Secure login and registration.

### Backend (API & Logic)
- **Django**: Handles the core medical data models and management commands.
- **Flask**: Serves the Machine Learning model via a dedicated REST API.

### Machine Learning
- **Random Forest Classifier**: Trained on comprehensive symptom-disease datasets.
- **Joblib**: For efficient model persistence and loading.

---

## 📋 Prerequisites

Before running the project, ensure you have the following installed:
- Python 3.8+
- Node.js & npm
- Git

---

## ⚙️ Installation & Setup

### 1. Clone the Repository
```bash
git clone https://github.com/sizor07/Disease-Prediction-and-Drug-Recommendation-System.git
cd Disease-Prediction-and-Drug-Recommendation-System
```

### 2. Backend Setup (Django & Flask)
```bash
# Install dependencies
pip install -r requirements.txt

# Run Django Migrations
python manage.py migrate

# Seed Database (Optional but recommended)
python manage.py load_medical_data
```

### 3. Frontend Setup (React)
```bash
cd health-client
npm install
```

---

## 🏃 How to Run

You need to run three separate services:

1. **Flask ML API**:
   ```bash
   # From root directory
   python app.py
   ```
   *Runs on http://127.0.0.1:5000*

2. **Django Backend**:
   ```bash
   # From root directory
   python manage.py runserver 8000
   ```
   *Runs on http://127.0.0.1:8000*

3. **React Frontend**:
   ```bash
   # From health-client directory
   npm start
   ```
   *Runs on http://localhost:3000*

---

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the Project
2. Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3. Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the Branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

---

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## ✨ Credits

Developed and Maintained by **[sizor07](https://github.com/sizor07)**.
