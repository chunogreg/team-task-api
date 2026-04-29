# Team Task Management API (RBAC-enabled)

A security-focused REST API for task management built with Node.js, Express, and MongoDB.

This project demonstrates production-style authentication and security practices including JWT authentication, refresh token rotation, reuse detection, and session management.

---

## Security Features

- **Advanced Authentication**: Full **JWT-based** system with **Refresh Token Rotation**
- **Reuse Detection:** Automatic invalidation of token families upon **Refresh Token Reuse Detection**
- **Session Management:** Secure Logout **(single device)** or a **Global Logout** from all active Devices
- **Data Protection:** Industry-standard **Password Hashing with bcrypt**
- **Threat Mitigation:** Integrated **Rate Limiting** and **suspicious Request Logging** to identify and block brute-force attempts.
- **Secure Transport:** Hardened Secure **HTTP-only cookies** and **Helmet security headers**
- Role-Based Access Control
- Ownership ckecks (users can only modify their own task)

---

## Other Feature

- **API Documentation**: Interactive **Swagger/OpenAPI** UI for live endpoint testing.

---

## Infrastructure & DevSecOps

- **Docker containerization**
- **CI/CD pipeline** using **GitHub Actions**
- Static application security testing with **Semgrep**
- **Container vulnerability** scanning using **Trivy**

---

## Tech Stack

- Node.js
- Express
- MongoDB (Mongoose)
- JSON Web Token (JWT)
- bcrypt (password hashing)
- Node.js crypto (refresh token hashing)
- cookie-parser
- helmet
- express-rate-limit
- morgan
- swagger (swagger-jsdoc + swagger UI)
- Docker

---

## API Endpoints

### Authentication

POST/api/auth/signup

POST/api/auth/login

POST/api/auth/refresh

POST/api/auth/logout

POST/api/auth/logout-all

---

### Tasks

GET /api/tasks

POST /api/tasks

PUT /api/tasks/:id

DELETE /api/tasks/:id

---

## Security Architecture

This API implements multiple security layers:

- Password are hashed using bcrypt before storage.
- Refresh tokens are stored hashed in MongoDB.
- Refresh token rotation ensures stolen tokens cannot be reused.
- Reuse detection revokes all sessions if token theft is detected.
- Helmet adds HTTP security headers.
- Rate limiting prevents brute-force login attempts.

---

## Pipeline Diagram

Developer push

&darr;

Github Actions

&darr;

SAST (Semgrep)

&darr;

Docker Build

&darr;

Container Scan (Trivy)

---

## Running the Project

Clone the repository:

    git clone

install dependencies:

    npm install

create a .env file with

    MONGODB_URI=yourmongodb_connection
    JWT_ACCESS_SECRET=your_secret_key

Start the server:

    npm run dev

Server runs on:

    http://localhost:3000

## Running with Docker

Build the image:

    docker build -t secure-task-api

Run the container

    docker run -p 3000:3000 secure-task-api

The API will be available at

    http://localhost:3000

Interactive API documentation

    http://localhost:3000/api-doc
