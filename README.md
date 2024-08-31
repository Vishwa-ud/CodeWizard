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
