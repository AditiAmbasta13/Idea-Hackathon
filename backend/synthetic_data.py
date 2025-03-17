import random
import pandas as pd
from faker import Faker

fake = Faker()

def generate_synthetic_data(num_records=1000):
    data = []
    for _ in range(num_records):
        customer_id = f"CUST{random.randint(1000, 9999)}"
        transaction_amount = random.randint(500, 500000)  # ₹500 - ₹5,00,000
        transaction_type = random.choice(["UPI", "NEFT", "IMPS", "RTGS", "Credit Card", "Debit Card"])
        location = random.choice(["Delhi", "Mumbai", "Bangalore", "Kolkata", "Patna", "Jaipur", "Chennai"])
        device = random.choice(["iPhone 13", "Samsung S22", "Redmi Note 10", "Vivo X70", "OnePlus 9"])
        past_fraud_history = random.choice(["Yes", "No"])
        previous_transaction_pattern = random.choice(["Normal", "High Frequency", "Large Transactions"])
        fraud_label = "Yes" if (transaction_amount > 200000 or past_fraud_history == "Yes") else "No"

        data.append({
            "customer_id": customer_id,
            "transaction_amount": transaction_amount,
            "transaction_type": transaction_type,
            "location": location,
            "device": device,
            "past_fraud_history": past_fraud_history,
            "previous_transaction_pattern": previous_transaction_pattern,
            "fraudulent": fraud_label
        })

    return pd.DataFrame(data)

# Generate 5000 synthetic records
df = generate_synthetic_data(5000)
df.to_csv("synthetic_fraud_data.csv", index=False)
print("Synthetic fraud data generated successfully!")
