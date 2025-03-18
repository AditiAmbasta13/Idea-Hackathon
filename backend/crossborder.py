from flask import Flask, request, jsonify
import joblib
import pandas as pd
from langchain.llms import OpenAI
import os
from flask_cors import CORS  # Import CORS

app = Flask(__name__)
CORS(app)  # Enable CORS for all routes

# Load trained model and preprocessor
model = joblib.load('fraud_detection_model.pkl')
preprocessor = joblib.load('preprocessor.pkl')

# Set OpenAI API Key
os.environ["OPENAI_API_KEY"] = "sk-SKe72HdqkldHdC9hZTAAc"  # Replace with your OpenAI API key
llm = OpenAI(temperature=0.5)

# Define allowed values
VALID_TRANSACTION_TYPES = ["POS Purchase", "Online Purchase", "ATM Withdrawal", "Wire Transfer"]
VALID_ACCOUNT_TYPES = ["Checking", "Savings", "Business"]
VALID_DEVICES = ["Card", "Mobile", "Desktop"]
VALID_LOCATIONS = ["Canada", "USA", "UK", "Germany"]
VALID_MERCHANT_CATEGORIES = ["Grocery", "Electronics", "Fashion", "Restaurants"]
VALID_RISK_CATEGORIES = ["Low", "Medium", "High"]

# API Endpoint
@app.route('/predict', methods=['POST'])
def predict_fraud():
    try:
        data = request.json  # Get input from frontend

        # Validate inputs
        required_fields = ["Account_Type", "Transaction_Amount", "Transaction_Hour", "Transaction_Type",
                           "Device_Used", "Location", "Merchant_Category", "Cross_Border_Flag",
                           "Cross_Border_Country", "Short_Lifespan_Account", "Insider_Threat_Flag",
                           "Regulatory_Flag", "Risk_Category", "Country_Risk_Level"]

        for field in required_fields:
            if field not in data:
                return jsonify({"error": f"Missing field: {field}"}), 400

        # Convert & validate numerical inputs
        try:
            data["Transaction_Amount"] = float(data["Transaction_Amount"])
            data["Transaction_Hour"] = int(data["Transaction_Hour"])
            data["Cross_Border_Flag"] = int(data["Cross_Border_Flag"])
            data["Short_Lifespan_Account"] = int(data["Short_Lifespan_Account"])
            data["Country_Risk_Level"] = int(data["Country_Risk_Level"])
        except ValueError:
            return jsonify({"error": "Invalid numerical value"}), 400

        # Check ranges
        if not (0 <= data["Transaction_Hour"] <= 23):
            return jsonify({"error": "Transaction Hour must be between 0-23"}), 400
        if not (0 <= data["Country_Risk_Level"] <= 4):
            return jsonify({"error": "Country Risk Level must be between 0-4"}), 400

        # Check valid categorical inputs
        if data["Transaction_Type"] not in VALID_TRANSACTION_TYPES:
            return jsonify({"error": f"Invalid Transaction Type. Choose from {VALID_TRANSACTION_TYPES}"}), 400
        if data["Account_Type"] not in VALID_ACCOUNT_TYPES:
            return jsonify({"error": f"Invalid Account Type. Choose from {VALID_ACCOUNT_TYPES}"}), 400
        if data["Device_Used"] not in VALID_DEVICES:
            return jsonify({"error": f"Invalid Device Used. Choose from {VALID_DEVICES}"}), 400
        if data["Location"] not in VALID_LOCATIONS:
            return jsonify({"error": f"Invalid Location. Choose from {VALID_LOCATIONS}"}), 400
        if data["Merchant_Category"] not in VALID_MERCHANT_CATEGORIES:
            return jsonify({"error": f"Invalid Merchant Category. Choose from {VALID_MERCHANT_CATEGORIES}"}), 400
        if data["Risk_Category"] not in VALID_RISK_CATEGORIES:
            return jsonify({"error": f"Invalid Risk Category. Choose from {VALID_RISK_CATEGORIES}"}), 400

        # Prepare data for prediction
        input_df = pd.DataFrame([data])

        # Apply the same preprocessing used during training
        input_df = preprocessor.transform(input_df)

        # Debugging: Check the shape of the preprocessed data
        print("Preprocessed input shape:", input_df.shape)

        # Make prediction
        prediction = model.predict(input_df)[0]  # Get fraud prediction (0 or 1)
        prediction_label = "Fraudulent" if prediction == 1 else "Legitimate"

        # Generate explanation using LLM
        prompt_template = f"""
        A transaction has been flagged as **{prediction_label}**. The transaction details are:

        - **Amount:** {data['Transaction_Amount']}
        - **Time:** {data['Transaction_Hour']}
        - **Country Risk Level:** {data['Country_Risk_Level']}
        - **Merchant Category:** {data['Merchant_Category']}
        - **Cross-Border:** {data['Cross_Border_Flag']}
        - **Account Type:** {data['Account_Type']}

        Provide a **clear and concise explanation** in bullet points, focusing on potential fraud indicators:

        - Highlight **suspicious patterns** (e.g., unusual transaction time, high-risk country, abnormal amount).
        - Explain why each factor contributes to **potential fraud detection**.
        - Be direct and structured.
        """

        explanation = llm(prompt_template)

        # Return JSON response
        return jsonify({
            "prediction": int(prediction),
            "prediction_label": prediction_label,
            "explanation": explanation
        })

    except Exception as e:
        return jsonify({"error": str(e)}), 500

if __name__ == '__main__':
    app.run(debug=True)