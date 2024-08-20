# Microservice Project with Frontend and API Gateway

This project demonstrates a basic microservice architecture with a frontend, multiple backend services, and an API Gateway, all running in Docker containers using Docker Compose.

## Project Structure

- **frontend/**: Contains the React frontend application.
- **services/**: Contains the microservices (e.g., service-1, service-2).
- **api-gateway/**: Contains the API Gateway configuration (using Nginx).
- **shared/**: Contains shared utilities or common configurations.
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
   ```

3. **Access the frontend:**
   - Open your browser and navigate to `http://localhost:3000`.

4. **API Gateway:**
   - The API Gateway routes requests to the appropriate services:
     - `http://localhost/service-1` -> Service 1
     - `http://localhost/service-2` -> Service 2

## Notes

- Ensure Docker and Docker Compose are installed on your machine.
- The frontend is served on port 3000.
- The API Gateway handles routing between the frontend and backend services.
