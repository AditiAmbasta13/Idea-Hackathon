from flask import Flask, request, jsonify
import firebase_admin
from firebase_admin import credentials, firestore
import google.generativeai as genai
import pickle
from datetime import datetime
import numpy as np
import requests
from datetime import datetime
from google.cloud import vision
import uuid
import os
import hashlib
import requests
import re
from flask_cors import CORS
from werkzeug.utils import secure_filename
import json
import random
from datetime import datetime, timedelta
import easyocr
from twilio.rest import Client
import time
from flask import Flask, request, jsonify
import random
import time
from google.cloud import vision
import re


app = Flask(__name__)
CORS(app)  # Enable CORS for all routes

# Configuration
UPLOAD_FOLDER = 'uploads'
ALLOWED_EXTENSIONS = {'png', 'jpg', 'jpeg', 'pdf'}
app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER
app.config['MAX_CONTENT_LENGTH'] = 16 * 1024 * 1024  # 16MB max upload

# Create upload directory if it doesn't exist
os.makedirs(UPLOAD_FOLDER, exist_ok=True)

# Initialize Firebase
cred = credentials.Certificate("firebase_key.json")
firebase_admin.initialize_app(cred)
db = firestore.client()


# Load the trained fraud detection model
with open("fraud_detection_model.pkl", "rb") as f:
    ml_model = pickle.load(f)

# Configure Gemini AI
genai.configure(api_key=os.environ.get("GEMINI_API_KEY"), transport="rest")
genai_model = genai.GenerativeModel("gemini-1.5-pro-latest")

def allowed_file(filename):
    return '.' in filename and filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS

def is_aadhaar_match(extracted_aadhaar, provided_aadhaar):
    """Check if the extracted Aadhaar number matches the provided Aadhaar number"""
    # Remove all non-digit characters from both numbers
    extracted_aadhaar = "".join(filter(str.isdigit, extracted_aadhaar))
    provided_aadhaar = "".join(filter(str.isdigit, provided_aadhaar))

    # Compare the cleaned Aadhaar numbers
    return extracted_aadhaar == provided_aadhaar

def extract_name(text):
    """Extract the name from the OCR text"""
    # Look for a sequence of words (alphabetic characters and spaces) after "Name:" or "नाम:"
    name_pattern = r"(?:Name:|नाम:)\s*([A-Za-z]+(?:\s[A-Za-z]+)+)"
    match = re.search(name_pattern, text, re.IGNORECASE)
    if match:
        return match.group(1).strip()
    return None

def extract_aadhaar_number(text):
    """Extract the Aadhaar number from the OCR text"""
    # Look for a 12-digit number, possibly separated by spaces
    aadhaar_pattern = r"\b(?:\d{4}\s?){3}\b"
    match = re.search(aadhaar_pattern, text)
    if match:
        # Remove spaces to get the full Aadhaar number
        return match.group(0).replace(" ", "")
    return None

def verify_aadhaar(aadhaar_number, image_path):
    """Verify Aadhaar details by checking only the Aadhaar number"""
    try:
        # Initialize the EasyOCR reader
        import easyocr
        reader = easyocr.Reader(['en'])  # Use 'en' for English

        # Extract text from the image
        results = reader.readtext(image_path)
        extracted_text = " ".join([result[1] for result in results])

        # Extract Aadhaar number from the text
        extracted_aadhaar = extract_aadhaar_number(extracted_text)

        # Check if Aadhaar number is present in the extracted text
        aadhaar_verified = is_aadhaar_match(extracted_aadhaar, aadhaar_number)

        # Generate explanation for Aadhaar verification
        verification_explanation = f"Aadhaar number '{extracted_aadhaar}' {'matches' if aadhaar_verified else 'does not match'} the provided Aadhaar number '{aadhaar_number}'."

        # Return verification result
        return {
            "aadhaar_verified": aadhaar_verified,
            "extracted_text": extracted_text,
            "extracted_aadhaar": extracted_aadhaar,
            "verification_explanation": verification_explanation
        }
    except Exception as e:
        return {
            "error": str(e),
            "aadhaar_verified": False,
            "extracted_text": "",
            "extracted_aadhaar": None,
            "verification_explanation": f"Aadhaar verification failed due to an error: {str(e)}"
        }

def verify_pan(pan_number, name):
    """Verify PAN with government API"""
    try:
        # Mock implementation for development
        pan_pattern = re.compile(r'^[A-Z]{5}[0-9]{4}[A-Z]{1}$')
        return bool(pan_pattern.match(pan_number))
    except Exception as e:
        app.logger.error(f"PAN verification error: {str(e)}")
        return False

def get_cibil_score(pan_number):
    """Get CIBIL score from credit bureau API"""
    try:
        # Mock implementation for development
        hash_value = int(hashlib.md5(pan_number.encode()).hexdigest(), 16)
        return 300 + (hash_value % 600)
    except Exception as e:
        app.logger.error(f"CIBIL score fetch error: {str(e)}")
        return 0

def check_fraud_history(pan_number, aadhaar_number):
    """Check if customer has fraud history in our database"""
    try:
        # Search for previous fraud incidents
        fraud_records = db.collection("fraud_records").where("pan_number", "==", pan_number).get()
        if len(list(fraud_records)) > 0:
            return "Yes"
            
        # Also check by Aadhaar
        fraud_records = db.collection("fraud_records").where("aadhaar_number", "==", aadhaar_number).get()
        if len(list(fraud_records)) > 0:
            return "Yes"
            
        return "No"
    except Exception as e:
        app.logger.error(f"Fraud history check error: {str(e)}")
        return "Unknown"

def analyze_aadhaar_document(file_path, name, dob, aadhaar_number):
    """Analyze Aadhaar document using Gemini AI"""
    prompt = f"""
    You are an expert document verification system. Analyze this Aadhaar document for:
    1. Signs of tampering or image manipulation
    2. Consistency of information (name: {name}, DOB: {dob})
    3. Presence of security features like hologram marks
    4. Proper QR code placement
    5. Typography and font consistency
    6. Microprint quality
    7. Clarity of photograph
    8. Consistency of Aadhaar number ({aadhaar_number})
    
    Look for typical fraud patterns:
    - Misaligned security features
    - Unusual color patterns 
    - Inconsistent text spacing
    - Blurred areas that may indicate tampering
    - Inconsistent shadows or lighting
    - Digital artifacts suggesting manipulation
    
    Provide a verification score (0-100) and detailed analysis.
    Include specific issues found and confidence level in your detection.
    """
    
    try:
        response = genai_model.generate_content(prompt)
        return response.text
    except Exception as e:
        app.logger.error(f"AI document analysis error: {str(e)}")
        return "Error analyzing document"

def analyze_pan_document(file_path, name, pan_number):
    """Analyze PAN document using Gemini AI"""
    prompt = f"""
    You are an expert document verification system. Analyze this PAN card document for:
    1. Signs of tampering or image manipulation
    2. Consistency of information (name: {name}, PAN: {pan_number})
    3. Presence of security features
    4. Typography and font consistency
    5. Signature quality and consistency
    6. Clarity of photograph
    
    Look for typical fraud patterns:
    - Misaligned text or images
    - Unusual color patterns 
    - Inconsistent text spacing
    - Blurred areas that may indicate tampering
    - Digital artifacts suggesting manipulation
    
    Provide a verification score (0-100) and detailed analysis.
    Include specific issues found and confidence level in your detection.
    """
    
    try:
        response = genai_model.generate_content(prompt)
        return response.text
    except Exception as e:
        app.logger.error(f"AI document analysis error: {str(e)}")
        return "Error analyzing document"

def extract_verification_score(analysis_text):
    """Extract verification score from AI analysis"""
    try:
        score_match = re.search(r'verification score:?\s*(\d+)', analysis_text, re.IGNORECASE)
        if score_match:
            return int(score_match.group(1))
        return 0
    except:
        return 0

def extract_document_issues(aadhaar_analysis, pan_analysis):
    """Extract document issues from AI analysis"""
    issues = []
    
    # Extract issues from Aadhaar analysis
    if "tampering" in aadhaar_analysis.lower():
        issues.append("Potential Aadhaar tampering detected")
    if "inconsistent" in aadhaar_analysis.lower():
        issues.append("Inconsistent information in Aadhaar")
    if "blurred" in aadhaar_analysis.lower():
        issues.append("Blurred areas in Aadhaar document")
    
    # Extract issues from PAN analysis
    if "tampering" in pan_analysis.lower():
        issues.append("Potential PAN tampering detected")
    if "inconsistent" in pan_analysis.lower():
        issues.append("Inconsistent information in PAN")
    if "blurred" in pan_analysis.lower():
        issues.append("Blurred areas in PAN document")
    
    return issues

def extract_email_domain(email):
    """Extract domain from email address"""
    try:
        return email.split('@')[1]
    except:
        return ""

def get_comprehensive_risk_assessment(risk_data):
    """Get comprehensive risk assessment using Gemini AI"""
    prompt = f"""
    You are an AI fraud detection specialist for an Indian bank.
    Analyze this new customer profile and assess the fraud risk:
    
    Name: {risk_data['name']}
    Age: {risk_data['age']}
    Gender: {risk_data['gender']}
    Location: {risk_data['location']}
    Aadhaar Verified: {risk_data['aadhaar_verified']}
    Aadhaar Score: {risk_data['aadhaar_score']}
    PAN Verified: {risk_data['pan_verified']}
    PAN Score: {risk_data['pan_score']}
    CIBIL Score: {risk_data['cibil_score']}
    Document Issues: {', '.join(risk_data['document_issues']) if risk_data['document_issues'] else 'None'}
    Email Domain: {risk_data['email_domain']}
    
    Provide a comprehensive fraud risk assessment including:
    1. Overall fraud risk score (0-100)
    2. Risk category (Very Low, Low, Medium, High, Very High)
    3. Likelihood of past fraud history (Yes/No/Unknown)
    4. Specific risk factors identified
    5. Recommended verification steps
    
    Format your response clearly with labeled sections.
    """
    
    try:
        response = genai_model.generate_content(prompt)
        return response.text
    except Exception as e:
        app.logger.error(f"AI risk assessment error: {str(e)}")
        return "Error generating risk assessment"

def extract_risk_score(assessment_text):
    """Extract risk score from assessment text"""
    try:
        score_match = re.search(r'risk score:?\s*(\d+)', assessment_text, re.IGNORECASE)
        if score_match:
            return int(score_match.group(1))
        return 50  # Default to medium risk if not found
    except:
        return 50

def categorize_risk(risk_score):
    """Categorize risk based on score"""
    if risk_score < 20:
        return "Very Low"
    elif risk_score < 40:
        return "Low"
    elif risk_score < 60:
        return "Medium"
    elif risk_score < 80:
        return "High"
    else:
        return "Very High"

def extract_fraud_history(assessment_text):
    """Extract fraud history assessment from AI analysis"""
    try:
        if re.search(r'fraud history:?\s*yes', assessment_text, re.IGNORECASE):
            return "Yes"
        elif re.search(r'fraud history:?\s*no', assessment_text, re.IGNORECASE):
            return "No"
        else:
            return "Unknown"
    except:
        return "Unknown"

def analyze_behavioral_patterns(mobile, email, name):
    """Analyze behavioral patterns using Gemini AI"""
    prompt = f"""
    You are an AI fraud detection specialist for an Indian bank.
    Analyze this customer's contact information for potential risk indicators:
    
    Mobile: {mobile}
    Email: {email}
    Name: {name}
    
    Look for patterns that might indicate risk:
    1. Email pattern analysis (temporary email, suspicious domain)
    2. Mobile number pattern (recently issued numbers often have patterns)
    3. Name-email consistency (does the email match the name pattern)
    4. Common fraud patterns in contact information
    
    Provide a behavioral risk score (0-100) and detailed analysis.
    Focus on patterns that correlate with fraud risk in Indian banking.
    """
    
    try:
        response = genai_model.generate_content(prompt)
        return response.text
    except Exception as e:
        app.logger.error(f"Behavioral analysis error: {str(e)}")
        return "Error analyzing behavioral patterns"

def extract_behavioral_risk_score(analysis_text):
    """Extract behavioral risk score from analysis"""
    try:
        score_match = re.search(r'risk score:?\s*(\d+)', analysis_text, re.IGNORECASE)
        if score_match:
            return int(score_match.group(1))
        return 30  # Default to moderate risk if not found
    except:
        return 30

def calculate_combined_risk(fraud_risk_score, behavioral_risk_score, cibil_score):
    """Calculate combined risk score based on multiple factors"""
    # Convert CIBIL score (300-900) to risk score (0-100) where higher CIBIL means lower risk
    cibil_risk = max(0, min(100, 100 - ((cibil_score - 300) / 600 * 100))) if cibil_score > 0 else 50
    
    # Weighted average of different risk scores
    combined_score = (
        fraud_risk_score * 0.5 +
        behavioral_risk_score * 0.3 +
        cibil_risk * 0.2
    )
    
    return round(combined_score)

def determine_verification_requirements(risk_score, risk_category):
    """Determine verification requirements based on risk score"""
    requirements = {
        "video_kyc": False,
        "additional_id_proof": False,
        "income_proof": False,
        "address_verification": False,
        "manual_review": False,
        "enhanced_monitoring": False
    }
    
    # Additional requirements based on risk level
    if risk_score > 30:  # Low-Medium risk and above
        requirements["address_verification"] = True
    
    if risk_score > 50:  # Medium risk and above
        requirements["additional_id_proof"] = True
        requirements["enhanced_monitoring"] = True
    
    if risk_score > 70:  # High risk and above
        requirements["video_kyc"] = True
        requirements["income_proof"] = True
    
    if risk_score > 85 or risk_category == "Very High":  # Very high risk
        requirements["manual_review"] = True
    
    return requirements

def generate_next_steps(needs_verification, verification_requirements):
    """Generate next steps based on verification requirements"""
    steps = []
    
    if not needs_verification:
        steps.append("Complete account setup")
        return steps
    
    # Add steps based on verification requirements
    if verification_requirements["address_verification"]:
        steps.append("Complete address verification")
    
    if verification_requirements["additional_id_proof"]:
        steps.append("Submit additional ID proof")
    
    if verification_requirements["income_proof"]:
        steps.append("Submit income proof documents")
    
    if verification_requirements["video_kyc"]:
        steps.append("Schedule video KYC session")
    
    if verification_requirements["manual_review"]:
        steps.append("Wait for manual review (1-2 business days)")
    
    return steps

def get_aadhaar_verification_explanation(aadhaar_verified, name_verified, extracted_name, extracted_aadhaar, provided_name, provided_aadhaar):
    """Generate an explanation for Aadhaar verification result"""
    explanation = []

    # Check if Aadhaar number was extracted
    if not extracted_aadhaar:
        explanation.append("Aadhaar number could not be extracted from the document.")
    else:
        # Check if the extracted Aadhaar number matches the provided one
        if aadhaar_verified:
            explanation.append(f"Aadhaar number '{extracted_aadhaar}' matches the provided Aadhaar number.")
        else:
            explanation.append(f"Aadhaar number '{extracted_aadhaar}' does not match the provided Aadhaar number '{provided_aadhaar}'.")

    # Check if name was extracted
    if not extracted_name:
        explanation.append("Name could not be extracted from the document.")
    else:
        # Check if the extracted name matches the provided one
        if name_verified:
            explanation.append(f"Name '{extracted_name}' matches the provided name.")
        else:
            explanation.append(f"Name '{extracted_name}' does not match the provided name '{provided_name}'.")

    # Combine explanations into a single string
    return " ".join(explanation)

@app.route('/customer-onboarding', methods=['POST'])
def customer_onboarding():
    """Enhanced customer onboarding API endpoint with Aadhaar verification"""
    # Validate request format
    if 'aadhaar_doc' not in request.files:
        return jsonify({"error": "Missing required Aadhaar document"}), 400
        
    # Extract form data
    form_data = request.form
    
    # Extract basic information
    name = form_data.get('name')
    dob = form_data.get('dob')
    gender = form_data.get('gender')
    mobile = form_data.get('mobile')
    email = form_data.get('email')
    address = form_data.get('address')
    city = form_data.get('city')
    state = form_data.get('state')
    pincode = form_data.get('pincode')
    
    # Extract ID information
    aadhaar_number = form_data.get('aadhaar_number')
    pan_number = form_data.get('pan_number', '')  # Optional
    
    # Validate required fields
    if not all([name, dob, mobile, email, aadhaar_number]):
        return jsonify({"error": "Missing required fields"}), 400
    
    # Generate unique customer ID
    customer_id = str(uuid.uuid4())
    
    # Save and analyze Aadhaar document
    aadhaar_doc = request.files['aadhaar_doc']
    aadhaar_file_path = None
    
    if aadhaar_doc and allowed_file(aadhaar_doc.filename):
        aadhaar_filename = secure_filename(f"{customer_id}_aadhaar.{aadhaar_doc.filename.rsplit('.', 1)[1].lower()}")
        aadhaar_file_path = os.path.join(app.config['UPLOAD_FOLDER'], aadhaar_filename)
        aadhaar_doc.save(aadhaar_file_path)
    
    # Verify Aadhaar
    aadhaar_verification = verify_aadhaar(aadhaar_number, aadhaar_file_path)
    
    if not aadhaar_verification.get('aadhaar_verified', False):
        return jsonify({
            "error": "Aadhaar verification failed",
            "details": aadhaar_verification
        }), 400
    
    # Save customer information to Firebase
    customer_data = {
        "customer_id": customer_id,
        "name": name,
        "dob": dob,
        "age": calculate_age(dob),
        "gender": gender,
        "mobile": mobile,
        "email": email,
        "address": address,
        "city": city,
        "state": state,
        "pincode": pincode,
        "aadhaar_number": aadhaar_number,
        "pan_number": pan_number if pan_number else None,
        "aadhaar_verified": aadhaar_verification['aadhaar_verified'],
        "extracted_aadhaar": aadhaar_verification['extracted_aadhaar'],
        "created_at": firestore.SERVER_TIMESTAMP,
        "last_updated": firestore.SERVER_TIMESTAMP,
        "verification_status": "pending"
    }
    
    db.collection("customers").document(customer_id).set(customer_data)
    
    # Return result with appropriate next steps
    return jsonify({
        "status": "success",
        "customer_id": customer_id,
        "name": name,
        "dob": dob,
        "age": calculate_age(dob),
        "gender": gender,
        "mobile": mobile,
        "email": email,
        "address": address,
        "city": city,
        "verification_status": {
            "aadhaar_verified": aadhaar_verification['aadhaar_verified'],
            "extracted_aadhaar": aadhaar_verification['extracted_aadhaar']
        },
        "verification_explanation": aadhaar_verification['verification_explanation'],
        "next_steps": ["Complete customer profile"]
    })

@app.route('/recommendations', methods=['POST'])
def get_recommendations():
    try:
        # Get customer ID from the request
        data = request.get_json()
        customer_id = data.get('customer_id')

        if not customer_id:
            return jsonify({"error": "Customer ID is required"}), 400

        # Generate recommendations
        recommendation = generate_product_recommendations(customer_features, customer_id)

        if "error" in recommendation:
            return jsonify({"error": recommendation["error"]}), 500

        # Return the recommendation
        return jsonify({
            "customer_id": customer_id,
            "recommendations": recommendation
        })

    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route('/profile-feedback', methods=['POST'])
def profile_feedback():
    """Provide profile feedback using GenAI"""
    data = request.json
    customer_id = data.get('customer_id')

    # Fetch customer data
    customer_ref = db.collection("customers").document(customer_id)
    customer_doc = customer_ref.get()
    if not customer_doc.exists:
        return jsonify({"error": "Customer not found"}), 404

    customer_data = customer_doc.to_dict()

    # Generate profile feedback using GenAI
    prompt = f"""
    You are an AI profile assistant. Analyze this customer's profile and provide feedback:
    
    Name: {customer_data.get('name')}
    Age: {calculate_age(customer_data.get('dob'))}
    Aadhaar Verified: {customer_data.get('aadhaar_verified')}
    PAN Verified: {customer_data.get('pan_verified', False)}
    
    Provide suggestions to improve profile completeness and security.
    """
    
    try:
        response = genai_model.generate_content(prompt)
        profile_feedback = response.text
    except Exception as e:
        app.logger.error(f"GenAI profile feedback error: {str(e)}")
        profile_feedback = "Profile analysis failed. Please try again."

    return jsonify({
        "customer_id": customer_id,
        "profile_feedback": profile_feedback
    })


@app.route('/transaction-insights', methods=['POST'])
def transaction_insights():
    """Generate transaction insights using GenAI"""
    data = request.json
    customer_id = data.get('customer_id')

    # Fetch transactions
    transactions = db.collection("transactions").where("customer_id", "==", customer_id).limit(100).get()
    transactions = [t.to_dict() for t in transactions]

    # Convert DatetimeWithNanoseconds to ISO strings
    for transaction in transactions:
        for key, value in transaction.items():
            if isinstance(value, datetime):
                transaction[key] = value.isoformat()

    # Generate insights using GenAI
    prompt = f"""
    You are an AI financial advisor. Analyze these transactions and provide insights:
    
    Transactions: {json.dumps(transactions)}
    
    Provide insights on:
    1. Spending patterns (e.g., most frequent expenses).
    2. Savings opportunities (e.g., reduce spending on unnecessary items).
    3. Fraud indicators (e.g., unusual transactions).
    """
    
    try:
        response = genai_model.generate_content(prompt)
        insights = response.text
    except Exception as e:
        app.logger.error(f"GenAI transaction insights error: {str(e)}")
        insights = "Error generating transaction insights."

    return jsonify({
        "customer_id": customer_id,
        "insights": insights
    })

@app.route('/fraud-tips', methods=['POST'])
def fraud_tips():
    """Generate fraud prevention tips using GenAI"""
    data = request.json
    customer_id = data.get('customer_id')

    # Fetch customer data
    customer_ref = db.collection("customers").document(customer_id)
    customer_doc = customer_ref.get()
    if not customer_doc.exists:
        return jsonify({"error": "Customer not found"}), 404

    customer_data = customer_doc.to_dict()
    risk_level = customer_data.get("risk_assessment", {}).get("combined_risk_level", "Medium")

    # Generate fraud prevention tips using GenAI
    prompt = f"""
    You are an AI fraud prevention assistant. Provide tips for this customer:
    
    Risk Level: {risk_level}
    
    Provide actionable tips to prevent fraud, such as:
    1. Monitor transactions regularly.
    2. Enable two-factor authentication.
    3. Avoid sharing sensitive information.
    """
    
    try:
        response = genai_model.generate_content(prompt)
        fraud_tips = response.text
    except Exception as e:
        app.logger.error(f"GenAI fraud tips error: {str(e)}")
        fraud_tips = "Error generating fraud prevention tips."

    return jsonify({
        "customer_id": customer_id,
        "fraud_tips": fraud_tips
    })

@app.route('/recommendations', methods=['POST'])
def recommendations():
    """Generate personalized recommendations using GenAI"""
    data = request.json
    customer_id = data.get('customer_id')

    # Fetch customer data
    customer_ref = db.collection("customers").document(customer_id)
    customer_doc = customer_ref.get()
    if not customer_doc.exists:
        return jsonify({"error": "Customer not found"}), 404

    customer_data = customer_doc.to_dict()
    risk_level = customer_data.get("risk_assessment", {}).get("combined_risk_level", "Medium")

    # Generate recommendations using GenAI
    prompt = f"""
    You are an AI financial advisor. Provide recommendations for this customer:
    
    Risk Level: {risk_level}
    
    Provide recommendations on:
    1. Saving money (e.g., reduce spending on unnecessary items).
    2. Investing (e.g., mutual funds, stocks).
    3. Fraud prevention (e.g., monitor transactions regularly).
    """
    
    try:
        response = genai_model.generate_content(prompt)
        recommendations = response.text
    except Exception as e:
        app.logger.error(f"GenAI recommendations error: {str(e)}")
        recommendations = "Error generating recommendations."

    return jsonify({
        "customer_id": customer_id,
        "recommendations": recommendations
    })

def calculate_age(dob_str):
    """Helper function to calculate age from DOB string"""
    try:
        dob_date = datetime.strptime(dob_str, "%Y-%m-%d")
        age = (datetime.now() - dob_date).days // 365
        return age
    except:
        return 0

def analyze_transactions(transactions, customer_id):
    """Analyze customer transaction patterns for risk assessment"""
    transaction_data = transactions
    
    if not transaction_data:
        return {
            "pattern": "new_user",
            "avg_transaction": 0,
            "transaction_count": 0,
            "frequency": "None",
            "unusual_activity": "None",
            "largest_transaction": 0,
            "transaction_times": []
        }
    
    # Extract transaction amounts and timestamps
    amounts = [t.get('amount', 0) for t in transaction_data]
    timestamps = [t.get('timestamp', None) for t in transaction_data]
    transaction_types = [t.get('type', '') for t in transaction_data]
    
    # Calculate basic statistics
    avg_transaction = sum(amounts) / len(amounts) if amounts else 0
    largest_transaction = max(amounts) if amounts else 0
    transaction_count = len(transaction_data)
    
    # Determine transaction frequency
    if transaction_count == 0:
        frequency = "None"
    elif transaction_count < 5:
        frequency = "Very Low"
    elif transaction_count < 15:
        frequency = "Low"
    elif transaction_count < 30:
        frequency = "Medium"
    elif transaction_count < 60:
        frequency = "High"
    else:
        frequency = "Very High"
    
    # Determine transaction pattern
    if avg_transaction > 50000:
        pattern = "high_value"
    elif avg_transaction > 10000:
        pattern = "medium_value"
    elif avg_transaction > 5000:
        pattern = "low_value"
    else:
        pattern = "micro_transactions"
    
    # Check for unusual activity
    unusual_activity = "None"
    
    # Check for large transactions
    large_transactions = [amount for amount in amounts if amount > 50000]
    if large_transactions:
        unusual_activity = f"Large transactions: {len(large_transactions)}"
    
    # Process transaction times
    transaction_times = []
    for timestamp in timestamps:
        if timestamp:
            # Convert Firestore timestamp to hour of day
            try:
                hour = timestamp.hour
                transaction_times.append(hour)
            except:
                pass
    
    # Get most common transaction hours
    hour_counts = {}
    for hour in transaction_times:
        hour_counts[hour] = hour_counts.get(hour, 0) + 1
    
    most_active_hours = sorted(hour_counts.items(), key=lambda x: x[1], reverse=True)[:3]
    most_active_hours = [hour for hour, count in most_active_hours]
    
    # AI-powered transaction analysis
    if transaction_count >= 10:
        ai_transaction_analysis = analyze_transactions_with_ai(transaction_data, customer_id)
        unusual_patterns = extract_unusual_patterns(ai_transaction_analysis)
        if unusual_patterns:
            unusual_activity = unusual_patterns
    
    return {
        "pattern": pattern,
        "avg_transaction": round(avg_transaction, 2),
        "transaction_count": transaction_count,
        "frequency": frequency,
        "unusual_activity": unusual_activity,
        "largest_transaction": largest_transaction,
        "most_active_hours": most_active_hours
    }

def analyze_transactions_with_ai(transaction_data, customer_id):
    """Analyze transactions using Gemini AI"""
    # Prepare a simplified transaction summary for the AI
    transaction_summary = []
    for i, t in enumerate(transaction_data[:20]):  # Limit to 20 transactions
        transaction_summary.append({
            "amount": t.get("amount", 0),
            "type": t.get("type", "unknown"),
            "recipient": t.get("recipient", "unknown"),
            "timestamp": str(t.get("timestamp", "unknown"))
        })
    
    prompt = f"""
    You are an AI transaction analysis specialist for a bank. Analyze these transactions for unusual patterns:
    
    Customer ID: {customer_id}
    Transaction Data: {json.dumps(transaction_summary)}
    
    Look for:
    1. Unusual transaction patterns
    2. Signs of fraudulent activity
    3. Money laundering indicators
    4. Account takeover indicators
    5. Unusual transaction times or amounts
    
    Provide a concise analysis focusing on potential risks or unusual patterns.
    """
    
    try:
        response = genai_model.generate_content(prompt)
        return response.text
    except Exception as e:
        app.logger.error(f"AI transaction analysis error: {str(e)}")
        return "Error analyzing transactions"

def extract_unusual_patterns(analysis_text):
    """Extract unusual patterns from AI analysis"""
    if "no unusual patterns" in analysis_text.lower():
        return "None"
    
    patterns = []
    if "unusual" in analysis_text.lower():
        patterns.append("Unusual patterns detected")
    if "fraud" in analysis_text.lower():
        patterns.append("Potential fraud indicators")
    if "money laundering" in analysis_text.lower():
        patterns.append("Money laundering indicators")
    if "account takeover" in analysis_text.lower():
        patterns.append("Account takeover indicators")
    
    return ", ".join(patterns) if patterns else "None"

def extract_risk_level(assessment_text):
    """Extract risk level from AI assessment"""
    risk_levels = ["Very Low", "Low", "Medium", "High", "Very High"]
    for level in risk_levels:
        if re.search(f"risk level:?\\s*{level}", assessment_text, re.IGNORECASE):
            return level
    return "Medium"  # Default

def extract_financial_health(assessment_text):
    """Extract financial health from AI assessment"""
    health_levels = ["Poor", "Fair", "Good", "Very Good", "Excellent"]
    for level in health_levels:
        if re.search(f"financial health:?\\s*{level}", assessment_text, re.IGNORECASE):
            return level
    return "Fair"  # Default

def extract_credit_worthiness(assessment_text):
    """Extract credit worthiness from AI assessment"""
    credit_levels = ["Poor", "Fair", "Good", "Very Good", "Excellent"]
    for level in credit_levels:
        if re.search(f"credit worthiness:?\\s*{level}", assessment_text, re.IGNORECASE):
            return level
    return "Fair"  # Default

def extract_credit_limit(assessment_text):
    """Extract recommended credit limit from AI assessment"""
    try:
        # Match pattern like "Recommended Credit Limit: ₹50,000" or "Credit Limit: 50000"
        match = re.search(r'credit limit:?\s*₹?(\d+[,\d]*)', assessment_text, re.IGNORECASE)
        if match:
            # Remove commas from the number
            limit_str = match.group(1).replace(',', '')
            return int(limit_str)
        return 0
    except:
        return 0

def categorize_risk(risk_score):
    """Categorize risk based on score"""
    if risk_score < 20:
        return "Very Low"
    elif risk_score < 40:
        return "Low"
    elif risk_score < 60:
        return "Medium"
    elif risk_score < 80:
        return "High"
    else:
        return "Very High"
    
def generate_risk_summary(name, combined_risk_score, combined_risk_level, financial_health, credit_worthiness, debt_to_income_ratio, recommended_credit_limit, transaction_analysis):
    """Generate a human-readable summary of the risk assessment using Gemini AI"""
    prompt = f"""
    You are an AI risk assessment specialist for an Indian bank. Summarize this customer's risk profile in a clear and concise paragraph:
    
    Customer Name: {name}
    Combined Risk Score: {combined_risk_score}
    Combined Risk Level: {combined_risk_level}
    Financial Health: {financial_health}
    Credit Worthiness: {credit_worthiness}
    Debt-to-Income Ratio: {debt_to_income_ratio}%
    Recommended Credit Limit: ₹{recommended_credit_limit}
    Transaction Analysis:
    - Pattern: {transaction_analysis.get('pattern', 'N/A')}
    - Average Transaction Size: ₹{transaction_analysis.get('avg_transaction', 0)}
    - Frequency: {transaction_analysis.get('frequency', 'N/A')}
    - Unusual Activity: {transaction_analysis.get('unusual_activity', 'None')}
    
    Provide a summary that includes:
    1. Overall risk level and score
    2. Financial health and creditworthiness
    3. Key risk factors (e.g., unusual transactions, high debt-to-income ratio)
    4. Recommended actions (e.g., enhanced monitoring, credit limit)
    
    Write in a professional and easy-to-understand tone.
    """
    
    try:
        response = genai_model.generate_content(prompt)
        return response.text
    except Exception as e:
        app.logger.error(f"AI risk summary generation error: {str(e)}")
        return "Error generating risk summary"
    

def generate_mock_transactions(customer_id, income, employment_status):
    """Generate mock transactions for a customer"""
    transactions = []
    num_transactions = random.randint(10, 50)  # Simulate 10-50 transactions
    start_date = datetime.now() - timedelta(days=90)  # Last 90 days

    for _ in range(num_transactions):
        transaction = {
            "customer_id": customer_id,
            "amount": random.randint(100, int(income * 0.1)),  # Up to 10% of income
            "type": random.choice(["debit", "credit"]),
            "timestamp": start_date + timedelta(days=random.randint(0, 90)),
            "recipient": random.choice(["Groceries", "Rent", "Utilities", "Entertainment", "Savings"])
        }
        transactions.append(transaction)

    return transactions


# Configure Google Gemini API
genai.configure(api_key="Gemini_api_key")

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

    *Employee Details:*
    - Role: {data.get('role', 'Unknown')}
    - Department: {data.get('department', 'Unknown')}

    *Risk Analysis:*
    - Risk Score: {risk_score} (Higher score means higher risk)
    - RBAC Violation: {data.get('is_rbac_violation', 0)}
    - Access Frequency: {data.get('access_frequency', 0)}
    - Access Volume: {data.get('access_volume', 0)}
    - Query Complexity: {data.get('query_complexity_very_complex', 0)}
    - Sensitive Data Accessed: {data.get('data_sensitivity_level_very_high', 0)}

    *Explanation:* Provide a concise and clear explanation in bullet points, as to why this transaction is flagged as a potential insider threat.
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


app = Flask(__name__)
CORS(app)  # Enable CORS for all routes

# Twilio credentials (replace with your actual values)
ACCOUNT_SID = 'ACCOOUNT SID'   # Get from Twilio Console
AUTH_TOKEN = '3TOKEN'     # Get from Twilio Console
TWILIO_NUMBER = '+19NO'     # Your Twilio number
RECIPIENT_NUMBER = '+91NUM'  # Replace with the recipient's number

# Initialize Twilio client
client = Client(ACCOUNT_SID, AUTH_TOKEN)

# Store OTPs temporarily (in-memory, replace with a database in production)
otp_storage = {}

# Generate a 6-digit OTP
def generate_otp():
    return str(random.randint(100000, 999999))

# Send OTP via Twilio
@app.route('/send-otp', methods=['POST'])
def send_otp():
    try:
        # Get credit card details from the request
        data = request.json
        card_number = data.get('cardNumber')
        cvv = data.get('cvv')
        expiry = data.get('expiry')

        # Validate input data
        if not card_number or not cvv or not expiry:
            return jsonify({'error': 'All fields are required'}), 400

        # Generate OTP
        otp = generate_otp()

        # Store OTP temporarily (for verification)
        otp_storage[RECIPIENT_NUMBER] = otp

        # Send OTP via SMS using Twilio
        message = client.messages.create(
            body=f"""
        ALERT: Unauthorized access attempt detected on your account XX98!  
        If this was NOT you, DO NOT share the OTP.  
     If you recognize this request, enter the OTP carefully: {otp}
        """,
            from_=TWILIO_NUMBER,
            to=RECIPIENT_NUMBER
        )
        print(f"OTP sent to {RECIPIENT_NUMBER}: {otp}")  # Debugging

        # Return success response
        return jsonify({
            'message': 'OTP sent successfully!',
            'otp': otp  # For debugging purposes only, remove in production
        }), 200

    except Exception as e:
        print(f"Error in send_otp: {e}")  # Debugging
        return jsonify({'error': 'Failed to send OTP. Please try again.'}), 500

@app.route('/verify-otp', methods=['POST'])
def verify_otp():
    try:
        # Get OTP and transaction amount from the request
        data = request.json
        user_otp = data.get('otp')


        # Retrieve stored OTP
        stored_otp = otp_storage.get(RECIPIENT_NUMBER)

        # Verify OTP
        if stored_otp and user_otp == stored_otp:
            # Generate Gemini AI assessment (fake but positive)
            prompt = f"""
            You are an AI financial advisor.:
            
            1. Provide a fake but encouraging statistic (e.g., "You saved 15% compared to last month").
            2. Give a recommendation for future transactions (e.g., "Consider using our rewards program for even more benefits").
            
            Make the assessment sound realistic and positive, even if the details are fabricated.
            """
            response = genai_model.generate_content(prompt)

            # Clear the OTP after successful verification
            otp_storage.pop(RECIPIENT_NUMBER, None)

            # Return success response with Gemini assessment
            return jsonify({
                'message': 'OTP verified successfully!',
                'assessment': response.text
            }), 200
        else:
            return jsonify({'error': 'Invalid OTP'}), 400

    except Exception as e:
        print(f"Error in verify_otp: {e}")  # Debugging
        return jsonify({'error': 'Failed to verify OTP. Please try again.'}), 500

if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0', port=int(os.environ.get('PORT', 5000)))
