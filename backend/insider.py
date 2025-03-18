from flask import Flask, request, jsonify
import pandas as pd
import google.generativeai as genai
from flask_cors import CORS

app = Flask(__name__)
CORS(app)  # Enable CORS for all routes

# Configure Google Gemini API
genai.configure(api_key="AIzaSyDoTRfSvv1zdW1Cj4afckjRQfbDFrKxErg")

# Function to calculate risk score
def calculate_risk_score(data):
    weights = {
        "is_rbac_violation": 0.3,
        "is_recent_activity": 0.2,
        "is_new_hire": 0.2,
        "is_fraud": 0.4,
        "access_frequency": 0.3,
        "access_volume": 0.3,
        "query_complexity_very_complex": 0.3,
        "data_sensitivity_level_very_high": 0.4,
        "is_resigned": 0.5
    }

    df = pd.DataFrame([data])
    scores = {key: df[key].values[0] * weight for key, weight in weights.items()}
    total_score = sum(scores.values())

    return round(total_score, 2), scores

# Function to generate explanation using Google Gemini API
def generate_explanation(data, risk_score):
    prompt = f"""
    A financial transaction has been flagged as an insider threat.

    **Employee Details:**
    - Role: {data.get('role', 'Unknown')}
    - Department: {data.get('department', 'Unknown')}

    **Risk Analysis:**
    - Risk Score: {risk_score} (Higher score means higher risk)
    - RBAC Violation: {data.get('is_rbac_violation', 0)}
    - Access Frequency: {data.get('access_frequency', 0)}
    - Access Volume: {data.get('access_volume', 0)}
    - Query Complexity: {data.get('query_complexity_very_complex', 0)}
    - Sensitive Data Accessed: {data.get('data_sensitivity_level_very_high', 0)}

    **Explanation:** Provide a concise and clear explanation in bullet points, as to why this transaction is flagged as a potential insider threat.
    """

    model = genai.GenerativeModel("gemini-1.5-pro-latest")
    response = model.generate_content(prompt)

    return response.text if response else "No explanation generated."

# API endpoint for analysis
@app.route('/analyze', methods=['POST'])
def analyze():
    try:
        input_data = request.get_json()

        # Validate input data
        required_fields = [
            "role", "department", "is_rbac_violation", "is_recent_activity",
            "is_new_hire", "is_fraud", "access_frequency", "access_volume",
            "query_complexity_very_complex", "data_sensitivity_level_very_high", "is_resigned"
        ]

        for field in required_fields:
            if field not in input_data:
                return jsonify({"error": f"Missing required field: {field}"}), 400

        # Ensure numeric fields are numbers
        numeric_fields = [
            "is_rbac_violation", "is_recent_activity", "is_new_hire", "is_fraud",
            "access_frequency", "access_volume", "query_complexity_very_complex",
            "data_sensitivity_level_very_high", "is_resigned"
        ]

        for field in numeric_fields:
            if not isinstance(input_data[field], (int, float)):
                return jsonify({"error": f"Field {field} must be a number"}), 400

        # Compute risk score
        risk_score, breakdown = calculate_risk_score(input_data)

        # Generate explanation using Google Gemini API
        explanation = generate_explanation(input_data, risk_score)

        response = {
            "risk_score": risk_score,
            "explanation": explanation,
            "score_breakdown": breakdown
        }

        return jsonify(response)

    except Exception as e:
        return jsonify({"error": str(e)}), 500

if __name__ == '__main__':
    app.run(debug=True)