### Project Overview

The Real-Time Rule Evaluation System is a web-based platform that allows users to create custom rules using logical expressions and evaluate them against provided data. It supports complex rules with nested conditions and offers robust error handling for invalid inputs or rule structures. The system is built using React.js for the frontend, Express.js for the backend, and MongoDB for data storage.

### Tech Stack
- Frontend: React.js, Axios, CSS
- Backend: Node.js, Express.js
- Database: MongoDB with Mongoose for data persistence
- Others: Axios for API requests, Express middleware for request validation

### Installation and Setup

## 1.Clone the Repository:

      git clone https://github.com/yourusername/rule-evaluation-system.git
      cd rule-evaluation-system

## 2. Setting Up the Backend
      Navigate to the backend folder and install dependencies:
          cd rule-engine-backend
          npm install
      Create a .env file in the backend folder and add your configuration:
          PORT=5000
          MONGO_URI=your_mongodb_connection_string
          Or
          I have mentioned my Mongo_URI
      Start the backend server:
          nodemon server.js
  ## 3. Setting Up the Frontend
      Navigate to the frontend folder and install dependencies:
          cd ../rule-engine-backend
          npm install
      Start the frontend development server:
          npm run dev
      Access the Application: Open your browser and navigate to http://localhost:3000
