from sklearn.model_selection import train_test_split
from sklearn.ensemble import RandomForestClassifier
from sklearn.preprocessing import LabelEncoder
from sklearn.metrics import accuracy_score
import pandas as pd

# Load Data
df = pd.read_csv("synthetic_fraud_data.csv")

# Encode categorical variables
encoder = LabelEncoder()
for col in ["transaction_type", "location", "device", "past_fraud_history", "previous_transaction_pattern"]:
    df[col] = encoder.fit_transform(df[col])

# Define Features and Labels
X = df.drop(columns=["fraudulent", "customer_id"])
y = df["fraudulent"].apply(lambda x: 1 if x == "Yes" else 0)

# Split Dataset
X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)

# Train Model
model = RandomForestClassifier(n_estimators=100, random_state=42)
model.fit(X_train, y_train)

# Evaluate Model
y_pred = model.predict(X_test)
accuracy = accuracy_score(y_test, y_pred)
print(f"Model Accuracy: {accuracy * 100:.2f}%")

import pickle

# Assuming your trained model is stored in a variable called `model`
with open("fraud_detection_model.pkl", "wb") as f:
    pickle.dump(model, f)

print("Model saved successfully!")
