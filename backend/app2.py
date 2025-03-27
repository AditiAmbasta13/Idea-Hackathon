from flask import Flask, request, jsonify
from flask_cors import CORS
from twilio.rest import Client
import random
import google.generativeai as genai

app = Flask(__name__)
CORS(app)  


ACCOUNT_SID = 'ACCOUNT_SID'  
AUTH_TOKEN = 'TOKEN'     
TWILIO_NUMBER = '+19NO'  
RECIPIENT_NUMBER = '+91NUM'  

# Initialize Twilio client
client = Client(ACCOUNT_SID, AUTH_TOKEN)

# Configure Gemini AI
genai.configure(api_key="GEmini_api_key")  
genai_model = genai.GenerativeModel("gemini-1.5-pro-latest")

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
    app.run(debug=True, port=5001) 
