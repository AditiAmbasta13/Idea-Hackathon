import random
from datetime import datetime, timedelta

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