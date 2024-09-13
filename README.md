# CodeBase-Analyzer-microservice

Microservice Project with Frontend and API Gateway

## ports

- ✅5000 : api gateway [all comms happened through here]
- 🚫3001 : codebase analyzer [no direct access use api-gateway]

## Project Structure

- **frontend/**: Contains the React frontend application.
- **services/**: Contains the microservices (e.g., codebase-analyzer, service-2).
- **api-gateway/**: Contains the API Gateway configuration.
- **docker-compose.yml**: Docker Compose configuration file to orchestrate the services.

## Setup Instructions

1. **Clone the repository:**

   ```bash
   git clone https://your-repo-url.git
   cd project-root
   ```

2. **Build and run the services:**

   ```bash
   docker-compose up --build
   python -m flask --app .\src\app.py run
   ```

3. **Access the frontend:**
   - vite
   - Open your browser and navigate to `http://localhost:5173`.

4. **API Gateway:**
   - The API Gateway routes requests to the appropriate services:

## Notes

- Ensure Docker and Docker Compose are installed on your machine.
- The frontend is served on port 3000.
- The API Gateway handles routing between the frontend and backend services.

```python
class BankAccount:
    interest_rate = 0.05  # class variable
    
    def __init__(self, account_number, account_holder, balance=0.0):
        self._account_number = account_number  # private variable
        self._account_holder = account_holder
        self._balance = balance
    
    # Property for balance
    @property
    def balance(self):
        return self._balance
    
    # Property setter for balance
    @balance.setter
    def balance(self, amount):
        if amount < 0:
            raise ValueError("Balance cannot be negative")
        self._balance = amount

    def deposit(self, amount):
        if amount <= 0:
            raise ValueError("Deposit amount must be positive")
        self._balance += amount

    def withdraw(self, amount):
        if amount <= 0:
            raise ValueError("Withdrawal amount must be positive")
        if amount > self._balance:
            raise ValueError("Insufficient balance")
        self._balance -= amount
    
    @classmethod
    def set_interest_rate(cls, rate):
        if rate < 0:
            raise ValueError("Interest rate cannot be negative")
        cls.interest_rate = rate

    @classmethod
    def calculate_interest(cls, balance):
        return balance * cls.interest_rate
    
    @staticmethod
    def is_valid_account_number(account_number):
        return isinstance(account_number, int) and len(str(account_number)) == 10

# Inheriting the BankAccount class
class SavingsAccount(BankAccount):
    def __init__(self, account_number, account_holder, balance=0.0, withdrawal_limit=1000):
        super().__init__(account_number, account_holder, balance)
        self.withdrawal_limit = withdrawal_limit

    def withdraw(self, amount):
        if amount > self.withdrawal_limit:
            raise ValueError(f"Cannot withdraw more than the limit of {self.withdrawal_limit}")
        super().withdraw(amount)
    
    def __str__(self):
        return f"SavingsAccount({self._account_number}, {self._account_holder}, Balance: {self._balance})"
```
