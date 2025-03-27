from flask import Flask, render_template, request, jsonify, send_file
from flask_cors import CORS  # Import CORS
import pandas as pd
import matplotlib
matplotlib.use('Agg')  # Use non-GUI backend to prevent Tkinter issues
import matplotlib.pyplot as plt
import seaborn as sns
import os
from datetime import timedelta
import openai

app = Flask(__name__)
CORS(app)  # Enable CORS for all routes

# Directly add your OpenAI API key
openai.api_key = "OPEN_AI_API"

# Ensure upload directory exists
UPLOAD_FOLDER = "uploads"
os.makedirs(UPLOAD_FOLDER, exist_ok=True)

# Load dataset
DATASET_PATH = os.path.join(UPLOAD_FOLDER, "user_activity_data.csv")

def load_data():
    try:
        df = pd.read_csv(DATASET_PATH, parse_dates=['timestamp'])
        return df
    except FileNotFoundError:
        return None

def analyze_transaction_data_with_gen_ai(df, user_id, small_transaction_threshold=50, large_transaction_threshold=10000, daily_transaction_limit=50, inactivity_days=30):
    """Analyzes transaction data for fraud detection using OpenAI's GPT API."""
    user_data = df[df['user_id'] == user_id].copy()
    if user_data.empty:
        return "No transaction data available for this user."

    user_data['date'] = user_data['timestamp'].dt.date

    prompt = f"""
    Analyze the following transaction data for user ID {user_id} to determine if the account is potentially fraudulent.
    Consider these factors:
    - High number of small transactions daily (threshold: {small_transaction_threshold})
    - Excessive daily transactions (limit: {daily_transaction_limit})
    - Sudden spike in transactions after a period of inactivity (inactivity threshold: {inactivity_days} days)
    - Unusually large transactions (threshold: {large_transaction_threshold})

    Provide a concise explanation of your reasoning. Focus on specific details from the data that support your conclusion.
    Answer with "Fraudulent" or "Not Fraudulent" followed by a comma and then the explanation.

    Transaction Data:
    {user_data.to_string()}
    """

    try:
        response = openai.ChatCompletion.create(
            model="gpt-3.5-turbo",
            messages=[
                {"role": "system", "content": "You are an AI financial fraud analyst."},
                {"role": "user", "content": prompt}
            ],
            max_tokens=150,
            temperature=0.5,
        )

        analysis_result = response.choices[0].message["content"].strip()
        return analysis_result

    except Exception as e:
        return f"Error: {e}"

@app.route("/flagged_accounts")
def get_flagged_accounts():
    """Endpoint to flag accounts with multiple small transactions."""
    df = load_data()
    if df is None:
        return jsonify({"error": "Data file not found"})

    flagged_accounts = flag_small_transaction_accounts(df)
    return jsonify({"flagged_accounts": list(flagged_accounts)})

def flag_small_transaction_accounts(df, amount_threshold=1000, time_window_minutes=1, transaction_count_threshold=3):
    """Flags accounts with multiple small transactions within a short time window."""
    if df is None:
        return set()

    df_transactions = df[df['activity_ty'] == 'transaction'].copy()
    if df_transactions.empty:
        return set()

    df_transactions = df_transactions.sort_values(by=['user_id', 'timestamp'])

    flagged_accounts = set()
    for user_id, user_data in df_transactions.groupby('user_id'):
        for i in range(len(user_data)):
            window_start = user_data.iloc[i]['timestamp']
            window_end = window_start + timedelta(minutes=time_window_minutes)
            window_transactions = user_data[
                (user_data['timestamp'] >= window_start) &
                (user_data['timestamp'] <= window_end) &
                (user_data['amount'] <= amount_threshold)
            ]

            if len(window_transactions) >= transaction_count_threshold:
                flagged_accounts.add(user_id)
                break  # No need to check further for this user

    return flagged_accounts

@app.route("/risk_analytics")
def get_risk_analytics():
    """Endpoint to perform AI-powered risk analytics."""
    df = load_data()
    if df is None:
        return jsonify({"error": "Data file not found"})

    analysis_result = ai_risk_analytics(df)
    return jsonify(analysis_result)

def ai_risk_analytics(df):
    """Performs basic AI-powered risk analytics (e.g., outlier detection, transaction patterns)."""
    if df is None:
        return {"error": "No data available"}

    df_transactions = df[df['activity_ty'] == 'transaction'].copy()
    if df_transactions.empty:
        return {"error": "No transaction data available"}

    mean_amount = df_transactions['amount'].mean()
    std_amount = df_transactions['amount'].std()
    outlier_threshold = mean_amount + 3 * std_amount

    outliers = df_transactions[df_transactions['amount'] > outlier_threshold]
    transaction_counts = df_transactions['transaction_type'].value_counts().to_dict()
    failed_transactions = df_transactions[df_transactions['status'] == 'failed']
    failed_counts = failed_transactions['user_id'].value_counts().head(5).to_dict()

    return {
        "outlier_transactions": outliers[['user_id', 'timestamp', 'amount']].to_dict(orient='records'),
        "transaction_type_distribution": transaction_counts,
        "top_failed_transactions": failed_counts
    }

@app.route("/feedback")
def get_feedback():
    """Endpoint to generate feedback insights."""
    df = load_data()
    if df is None:
        return jsonify({"error": "Data file not found"})

    feedback_result = generate_feedback(df)
    return jsonify(feedback_result)

def generate_feedback(df):
    """Generates feedback insights for user activity."""
    if df is None:
        return {"error": "No data available"}

    login_logout = df[df['activity_ty'].isin(['login', 'logout'])].copy()
    if login_logout.empty:
        return {"error": "No login/logout data available"}

    login_logout['date'] = login_logout['timestamp'].dt.date
    daily_logins = {
        str(date): count for date, count in login_logout[
            login_logout['activity_ty'] == 'login'
        ].groupby('date')['user_id'].nunique().items()
    }

    df['hour'] = df['timestamp'].dt.hour
    hourly_activity = df['hour'].value_counts().sort_index().to_dict()
    active_users = df['user_id'].value_counts().head(5).to_dict()

    return {
        "daily_unique_logins": daily_logins,
        "hourly_activity_distribution": hourly_activity,
        "most_active_users": active_users
    }

@app.route("/user_ids")
def get_user_ids():
    """Endpoint to fetch all user IDs from the dataset."""
    df = load_data()
    if df is None:
        return jsonify({"error": "Data file not found"}), 404

    user_ids = df['user_id'].unique().tolist()
    return jsonify({"user_ids": user_ids})

@app.route("/")
def home():
    """Main dashboard page."""
    return render_template("index.html")

@app.route("/upload", methods=["POST"])
def upload_file():
    """Upload a new dataset."""
    if "file" not in request.files:
        return jsonify({"error": "No file uploaded"}), 400

    file = request.files["file"]
    if file.filename == "":
        return jsonify({"error": "No selected file"}), 400

    file.save(DATASET_PATH)
    return jsonify({"message": "File uploaded successfully"}), 200

@app.route("/graph/<graph_type>")
def generate_graph(graph_type):
    """Generate different types of graphs based on user activity data."""
    df = load_data()
    if df is None:
        return jsonify({"error": "Dataset not found"}), 404

    plt.figure(figsize=(10, 5))

    if graph_type == "dau":
        # Daily Active Users (DAU)
        df["date"] = df["timestamp"].dt.date
        df.groupby("date")["user_id"].nunique().plot()
        plt.xlabel("Date")
        plt.ylabel("DAU")
        plt.title("Daily Active Users")

    elif graph_type == "activity_distribution":
        # Fix for activity_ty column
        if "activity_ty" in df.columns:
            df["activity_ty"].value_counts().plot(kind="bar")
            plt.xlabel("Activity Type")
            plt.ylabel("Count")
            plt.title("Activity Type Distribution")
        else:
            return jsonify({"error": "Column 'activity_ty' not found"}), 404

    elif graph_type == "transaction_amount":
        # Transaction Amount Distribution
        if "amount" in df.columns and "activity_ty" in df.columns:
            sns.histplot(df[df["activity_ty"] == "transaction"]["amount"], kde=True)
            plt.xlabel("Transaction Amount")
            plt.ylabel("Frequency")
            plt.title("Transaction Amount Distribution")
        else:
            return jsonify({"error": "Columns 'activity_ty' or 'amount' not found"}), 404

    elif graph_type == "activities_per_user":
        # Number of activities per user
        if "activity_ty" in df.columns:
            df.groupby("user_id")["activity_ty"].count().plot(kind="bar")
            plt.xlabel("User ID")
            plt.ylabel("Number of Activities")
            plt.title("Number of Activities per User")
        else:
            return jsonify({"error": "Column 'activity_ty' not found"}), 404

    elif graph_type == "transaction_status":
        # Transaction Status Distribution
        if "status" in df.columns and "activity_ty" in df.columns:
            df[df["activity_ty"] == "transaction"]["status"].value_counts().plot(kind="pie", autopct="%1.1f%%")
            plt.title("Transaction Status Distribution")
        else:
            return jsonify({"error": "Columns 'activity_ty' or 'status' not found"}), 404

    elif graph_type == "transaction_type":
        # Transaction Type Distribution
        if "transaction_type" in df.columns and "activity_ty" in df.columns:
            df[df["activity_ty"] == "transaction"]["transaction_type"].value_counts().plot(kind="pie", autopct="%1.1f%%")
            plt.title("Transaction Type Distribution")
        else:
            return jsonify({"error": "Columns 'activity_ty' or 'transaction_type' not found"}), 404

    else:
        return jsonify({"error": "Invalid graph type"}), 400

    graph_path = os.path.join(UPLOAD_FOLDER, f"{graph_type}.png")
    plt.savefig(graph_path)
    plt.close()
    
    return send_file(graph_path, mimetype="image/png")

@app.route("/fraud_analysis", methods=["GET"])
def fraud_analysis():
    """Endpoint to analyze fraud risk for a given user."""
    df = load_data()
    if df is None:
        return jsonify({"error": "No transaction data available"}), 400

    user_id = request.args.get("user_id", type=int)
    if user_id is None:
        return jsonify({"error": "Missing user_id parameter"}), 400

    result = analyze_transaction_data_with_gen_ai(df, user_id)
    return jsonify({"user_id": user_id, "fraud_analysis": result})

if __name__ == "__main__":
    app.run(debug=True)
