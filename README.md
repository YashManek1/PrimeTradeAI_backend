# PrimeTradeAI Task Manager API

## 📋 Project Overview

A production-ready REST API built with **Node.js**, **Express**, and **MongoDB** featuring user authentication, role-based access control (RBAC), and task management. This project demonstrates scalable backend architecture with security best practices, comprehensive API documentation, and a simple React frontend for API interaction.

**🎯 Built as a Backend Developer Intern Assignment for PrimeTrade.ai** - To showcase backend development skills, API design, security implementation, and full-stack integration capabilities according to the provided assignment specification.

---

## ✨ Core Features Implemented

### ✅ Backend (Primary Focus)

- **User Authentication**: Secure user registration & login APIs using JWT tokens and bcrypt password hashing.
- **Role-Based Access Control**: Differentiates between `user` and `admin` roles, protecting specific endpoints.
- **Task Management CRUD API**: Full Create, Read, Update, Delete operations for a secondary 'tasks' entity.
- **API Versioning**: Base path set to `/api/v1/` for future scalability.
- **Input Validation**: Uses `express-validator` to validate request bodies for core endpoints.
- **Centralized Error Handling**: Middleware ensures consistent error responses.
- **Database Schema**: MongoDB schema defined for Users and Tasks using Mongoose.
- **API Documentation**: Interactive Swagger UI documentation generated from JSDoc comments in route files.
- **Security**: Includes password hashing (bcrypt), JWT handling, and input validation.
- **(Optional) Caching**: Implemented Redis caching for GET task requests to improve performance.
- **(Optional) Docker Deployment**: Dockerfiles for backend and frontend, plus `docker-compose.yml` for multi-container setup included.

### ✅ Basic Frontend (Supportive)

- **Framework**: Built with React.js.
- **UI Components**: Simple UI for user registration, login, a protected dashboard, and task CRUD actions.
- **Authentication Flow**: Handles JWT token storage (localStorage) and includes it in authenticated API requests.
- **API Interaction**: Uses Axios to communicate with the backend API.
- **Feedback**: Displays basic error/success messages based on API responses (implementation varies by component).

---

## 🗂️ Project Structure

```
PrimeTradeAI/
├── backend/
│   ├── controllers/        # Request handlers (user, task)
│   ├── middlewares/        # Auth, validation, error handling
│   ├── models/             # MongoDB schemas (User, Task)
│   ├── routes/             # API route definitions
│   ├── utils/              # DB connection, Redis client
│   ├── server.js           # Application entry point
│   ├── swagger.js          # Swagger documentation config
│   ├── .env.example         # Environment variables template
│   └── package.json         # Backend dependencies
├── frontend/                # React.js UI
│   ├── public/             # Static assets
│   ├── src/
│   │   ├── components/      # React components (Auth, Dashboard, Admin, Layout)
│   │   ├── hooks/           # Custom hooks (useAuth, useTasks)
│   │   ├── pages/           # Page components (Home, NotFound)
│   │   ├── utils/           # API utility (axios setup)
│   │   ├── App.js           # Main application component
│   │   ├── index.js         # React entry point
│   │   └── ...              # Other React files
│   ├── .env                 # Frontend environment variables
│   └── package.json         # Frontend dependencies
├── backend/Dockerfile       # Docker configuration for backend
├── frontend/Dockerfile      # Docker configuration for frontend
├── docker-compose.yml       # Multi-container Docker setup
└── README.md               # This file
```

---

## 🛠️ Technology Stack

### Backend

- **Runtime**: Node.js (v18+)
- **Framework**: Express.js
- **Database**: MongoDB (Mongoose ODM)
- **Authentication**: JWT (jsonwebtoken) + bcryptjs
- **Caching**: Redis
- **Validation**: express-validator
- **API Documentation**: Swagger (swagger-jsdoc, swagger-ui-express)
- **Logging**: pino-http, pino-pretty
- **Security**: CORS

### Frontend

- **Framework**: React.js (v18+)
- **HTTP Client**: Axios
- **Routing**: React Router DOM
- **Styling**: Basic CSS

### DevOps

- **Containerization**: Docker + Docker Compose
- **Version Control**: Git/GitHub

---

## 🚀 Quick Start Guide

### Prerequisites

- Node.js (v18+)
- MongoDB (local instance or Atlas connection string)
- Redis (local instance or cloud connection string)
- Git
- Docker & Docker Compose (Optional, for containerized deployment)

---

### Installation & Setup

1.  **Clone the Repository**

    ```bash
    git clone [https://github.com/YashManek1/PrimeTradeAI.git](https://github.com/YashManek1/PrimeTradeAI.git)
    cd PrimeTradeAI
    ```

2.  **Backend Setup**

    ```bash
    cd backend
    npm install
    ```

    Create a `.env` file in the `backend` directory based on `.env.example` and fill in your details:

    ```env
    PORT=3000
    MONGODB_URI=<your_mongodb_connection_string>
    REDIS_URL=<your_redis_connection_string>
    JWT_SECRET=<your_strong_jwt_secret>
    ```

    _Make sure MongoDB and Redis services are running._

    **Run Backend:**

    ```bash
    # Development mode (with nodemon for hot-reloading)
    npm run dev

    # Production mode
    npm start
    ```

    The backend API will start at `http://localhost:3000`.

3.  **Frontend Setup**
    ```bash
    cd ../frontend
    npm install
    ```
    Create a `.env` file in the `frontend` directory:
    ```env
    REACT_APP_API_URL=http://localhost:3000/api/v1
    ```
    **Run Frontend:**
    ```bash
    npm start
    ```
    The frontend application will start at `http://localhost:3001` (or another port if 3001 is busy).

---

## 🐳 Docker Deployment (Optional)

1.  Ensure Docker and Docker Compose are installed.
2.  Create the `backend/.env` file as described in the Backend Setup section. Ensure `MONGODB_URI` and `REDIS_URL` point to accessible services (e.g., MongoDB Atlas, cloud Redis, or services running within Docker Compose). **Note:** The provided `docker-compose.yml` includes basic MongoDB and Redis services; update the `.env` accordingly if using them (e.g., `MONGODB_URI=mongodb://mongo:27017/primetradeai`, `REDIS_URL=redis://redis:6379`).
3.  From the project root directory (containing `docker-compose.yml`):
    ```bash
    # Build and start services in detached mode
    docker-compose up --build -d
    ```
4.  - Backend API will be available at `http://localhost:3000`.
    - Frontend UI will be available at `http://localhost:3001`.

    _Use `docker-compose down` to stop and remove the containers._

---

## 📚 API Documentation & Endpoints

### Swagger UI

Interactive API documentation is available via Swagger UI when the backend is running:
**`http://localhost:3000/api-docs`**

### Authentication Flow

1.  **Register:** `POST /api/v1/users/register`
2.  **Login:** `POST /api/v1/users/login` (returns JWT token and user info)
3.  **Authenticated Requests:** Include the obtained JWT token in the `Authorization` header for protected endpoints:
    ```
    Authorization: Bearer <your-jwt-token>
    ```

### Core API Endpoints

(See Swagger UI at `/api-docs` for detailed request/response schemas)

- **Users** (`/api/v1/users/`):
  - `POST /register`: Create a new user.
  - `POST /login`: Authenticate and get JWT.
  - `GET /me`: Get current user's profile (Requires Auth).
  - `PUT /me`: Update current user's profile (Requires Auth).
- **Tasks** (`/api/v1/tasks/`): (Require Auth)
  - `POST /`: Create a new task.
  - `GET /`: Get all tasks for the current user.
  - `PUT /:id`: Update a specific task owned by the user.
  - `DELETE /:id`: Delete a specific task owned by the user.
- **Admin** (`/api/v1/.../admin/`): (Require Auth + Admin Role)
  - `GET /users/admin/all`: Get all users.
  - `PATCH /users/admin/:id/role`: Change a user's role.
  - `GET /tasks/admin/all`: Get all tasks from all users.
  - `DELETE /tasks/admin/:id`: Delete any task by ID.

_(A Postman collection `postman.json` is also included in the backend directory for testing)_

---

## 🗄️ Database Schema (MongoDB)

### User Schema (`backend/models/user.js`)

- `username`: String (required, unique)
- `email`: String (required, unique)
- `password`: String (required, hashed)
- `role`: String (enum: ['user', 'admin'], default: 'user')
- `createdAt`: Date (default: Date.now)

### Task Schema (`backend/models/task.js`)

- `title`: String (required)
- `description`: String (required)
- `status`: String (enum: ['pending', 'in-progress', 'completed'], default: 'pending')
- `userId`: ObjectId (ref: 'User', required)
- `createdAt`: Date (default: Date.now)

---

## 📈 Scalability Considerations

- **Stateless API**: The backend is largely stateless, relying on JWT for authentication, which aids horizontal scaling.
- **Database Indexing**: Basic indexes can be added to MongoDB schemas (`userId` on Tasks, `email`/`username` on Users) to optimize query performance as data grows.
- **Caching**: Redis is implemented for caching `GET /tasks` requests, reducing database load. Cache invalidation occurs on task creation, update, and deletion.
- **API Versioning**: `/api/v1/` allows for introducing breaking changes in future versions without affecting existing clients.
- **Containerization**: Docker support allows for easy deployment and scaling using orchestration tools (like Kubernetes).
- **Future Steps**:
  - Implement database connection pooling optimizations.
  - Add more comprehensive logging and monitoring.
  - Introduce rate limiting.
  - Consider a message queue for potentially long-running tasks (if applicable later).
  - For very large scale, explore microservices architecture (e.g., separate Auth and Task services) and database sharding.

---

## 🔒 Security Practices

- **Password Hashing**: User passwords are securely hashed using `bcryptjs` before storing.
- **JWT Authentication**: Stateless authentication is handled via JSON Web Tokens signed with a secret key.
- **Authorization (RBAC)**: Middleware checks user roles (`user` vs `admin`) to restrict access to sensitive endpoints.
- **Input Validation**: `express-validator` is used to sanitize and validate user input on API routes, preventing common injection vectors.
- **Environment Variables**: Sensitive configurations like database URIs, JWT secrets, and Redis URLs are stored in environment variables, not hardcoded.
- **CORS**: Basic CORS configuration is enabled.

---

## ✅ Assignment Deliverables Checklist

- [✅] Backend project hosted in GitHub with README.md setup.
- [✅] Working APIs for authentication (Register, Login) & CRUD (Tasks).
- [✅] Role-based access implemented (User vs Admin).
- [✅] Basic React frontend UI connecting to APIs (Register, Login, Dashboard, Task CRUD).
- [✅] API documentation provided (Swagger UI at `/api-docs`).
- [✅] Database schema defined (MongoDB with Mongoose).
- [✅] Short scalability note included in README.
- [✅] (Optional) Docker deployment files included.
- [✅] (Optional) Redis caching implemented.

---

## 📧 Contact

**Developer**: Yash Manek
**GitHub**: [@YashManek1](https://github.com/YashManek1)
