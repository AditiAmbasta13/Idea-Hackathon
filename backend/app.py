from flask import Flask, request, jsonify
import firebase_admin
from firebase_admin import credentials, firestore
import google.generativeai as genai
import pickle
import numpy as np

app = Flask(__name__)

# Initialize Firebase
cred = credentials.Certificate("firebase_key.json")  # Replace with your Firebase key
firebase_admin.initialize_app(cred)
db = firestore.client()

# Load the trained fraud detection model
with open("fraud_detection_model.pkl", "rb") as f:
    ml_model = pickle.load(f)

# Configure Gemini AI
genai.configure(api_key="AIzaSyBJAMfohbi-WOjGkKGbIBNeUWx5pPXja7s", transport="rest")
genai_model = genai.GenerativeModel("gemini-1.5-pro-latest")


@app.route('/customer-profile', methods=['POST'])
def customer_profile():
    data = request.json  # Receive JSON data

    # Extract fields
    name = data.get('name')
    age = data.get('age', 0)
    employment_status = data.get('employment_status', 'unknown')
    cibil_score = data.get('cibil_score', 0)
    income = data.get('income', 0)
    loan_amount = data.get('loan_amount', 0)
    upi_behavior = data.get('upi_behavior', 'normal')
    aadhaar_verified = data.get('aadhaar_verified', False)
    pan_verified = data.get('pan_verified', False)
    location = data.get('location', 'unknown')
    past_fraud_history = data.get('past_fraud_history', 'No')

    # Ensure essential fields exist
    if not all([name, cibil_score, income, age]):
        return jsonify({"error": "Missing required fields"}), 400

    # AI-based Risk Assessment using Gemini
    prompt = f"""
    You are an AI fraud detection analyst for an Indian bank. Evaluate the risk of a customer during onboarding based on:
    - Name: {name}
    - Age: {age}
    - Employment Status: {employment_status}
    - CIBIL Score: {cibil_score}
    - Income: ₹{income}
    - Loan Amount: ₹{loan_amount}
    - UPI Transaction Behavior: {upi_behavior}
    - Aadhaar Verified: {aadhaar_verified}
    - PAN Verified: {pan_verified}
    - Location: {location}
    - Past Fraud History: {past_fraud_history}

    Assign a risk level (Low, Medium, High) and explain why.
    """
    response = genai_model.generate_content(prompt)
    ai_risk_assessment = response.text  # AI-generated risk evaluation

    # ML Model Prediction
    features = np.array([
        age, income, loan_amount, cibil_score,  # Existing 4 features
        1 if aadhaar_verified else 0,  # Convert Boolean to numeric
        1 if pan_verified else 0  # Convert Boolean to numeric
    ]).reshape(1, -1)
    ml_prediction = ml_model.predict(features)[0]
    ml_risk_level = "High" if ml_prediction == 1 else "Low"

    # Save to Firebase
    customer_data = {
        "name": name,
        "age": age,
        "employment_status": employment_status,
        "cibil_score": cibil_score,
        "income": income,
        "loan_amount": loan_amount,
        "upi_behavior": upi_behavior,
        "aadhaar_verified": aadhaar_verified,
        "pan_verified": pan_verified,
        "location": location,
        "past_fraud_history": past_fraud_history,
        "ai_risk_assessment": ai_risk_assessment,
        "ml_risk_level": ml_risk_level
    }
    db.collection("customer_profiles").add(customer_data)

    return jsonify({
        "name": name,
        "ai_risk_assessment": ai_risk_assessment,
        "ml_risk_level": ml_risk_level
    })


@app.route('/transaction-monitor', methods=['POST'])
def transaction_monitor():
    data = request.json  # Receive JSON transaction data

    # Extract fields
    customer_id = data.get('customer_id')
    transaction_amount = data.get('transaction_amount', 0)
    transaction_type = data.get('transaction_type', 'Unknown')
    location = data.get('location', 'Unknown')
    device = data.get('device', 'Unknown')
    past_fraud_history = data.get('past_fraud_history', 'No')
    previous_transaction_pattern = data.get('previous_transaction_pattern', 'Normal')

    # Ensure essential fields exist
    if not all([customer_id, transaction_amount, transaction_type, location]):
        return jsonify({"error": "Missing required fields"}), 400

    # AI-based Fraud Detection using Gemini
    prompt = f"""
    You are an AI fraud detection analyst for an Indian bank. Evaluate if the following transaction is fraudulent based on:
    - Customer ID: {customer_id}
    - Transaction Amount: ₹{transaction_amount}
    - Transaction Type: {transaction_type}
    - Location: {location}
    - Device Used: {device}
    - Past Fraud History: {past_fraud_history}
    - Previous Transaction Pattern: {previous_transaction_pattern}

    Assign a fraud risk level (Low, Medium, High) and explain why.
    """
    response = genai_model.generate_content(prompt)
    ai_fraud_risk_assessment = response.text  # AI-generated fraud risk evaluation

    # ML Model Prediction (if applicable)
    # Example: If ML model is trained for fraud detection, extract necessary fields and predict
    # For now, we assume only AI-based fraud assessment is used.

    # Save to Firebase
    transaction_data = {
        "customer_id": customer_id,
        "transaction_amount": transaction_amount,
        "transaction_type": transaction_type,
        "location": location,
        "device": device,
        "past_fraud_history": past_fraud_history,
        "previous_transaction_pattern": previous_transaction_pattern,
        "ai_fraud_risk_assessment": ai_fraud_risk_assessment
    }
    db.collection("fraud_detection").add(transaction_data)

    return jsonify({
        "customer_id": customer_id,
        "ai_fraud_risk_assessment": ai_fraud_risk_assessment
    })


if __name__ == '__main__':
    app.run(debug=True)
