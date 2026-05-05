import pandas as pd
from sklearn.tree import DecisionTreeClassifier
from sklearn.metrics import accuracy_score
import joblib

# 1. Load training data
train_df = pd.read_csv("Training.csv")
X_train = train_df.drop(columns=["prognosis"])
y_train = train_df["prognosis"]

# 2. Train the model
model = DecisionTreeClassifier()
model.fit(X_train, y_train)

# 3. Save model
joblib.dump(model, "disease_prediction_model.joblib")

# 4. Load test data
test_df = pd.read_csv("Testing.csv")
X_test = test_df.drop(columns=["prognosis"])
y_test = test_df["prognosis"]

# 5. Predict and calculate accuracy
y_pred = model.predict(X_test)
accuracy = accuracy_score(y_test, y_pred)
print(f"Model Accuracy: {accuracy:.2f}")
