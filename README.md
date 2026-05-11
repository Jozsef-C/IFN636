# Festival Ticket Management System

## Overview

This project is a full-stack web application that allows users to browse festival events, book tickets, and manage their bookings. It also includes an admin dashboard for managing events and ticket types.

The system was developed using a modern MERN-style architecture (MongoDB, Express, React, Node.js) and follows software development lifecycle practices such as version control, feature branching, testing, and deployment.

---

## Features

### User Features

* Register and login
* View available events
* View event details and ticket types
* Book tickets for events
* View personal bookings
* Cancel bookings

### Admin Features

* Access admin dashboard
* Create, edit, and delete events
* Create, edit, and delete ticket types
* Manage ticket availability and pricing

### Security

* JWT-based authentication
* Protected routes for users and admins
* Role-based access control (admin vs normal user)

---

## Tech Stack

### Frontend

* React.js
* Axios
* React Router

### Backend

* Node.js
* Express.js
* MongoDB (MongoDB Atlas)
* Mongoose

### DevOps

* Git & GitHub (feature branching and pull requests)
* GitHub Actions (automated testing)
* AWS EC2 (deployment)
* PM2 (process management)

---

## How to Run the Application (Local)

### 1. Clone the repository

```bash
git clone https://github.com/Jozsef-C/IFN636
cd IFN636
```

### 2. Install dependencies

```bash
npm install
cd backend && npm install
cd ../frontend && npm install
```

### 3. Configure environment variables

Create a `.env` file inside the `backend` folder:

```
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_secret_key
PORT=5001
```

### 4. Run the application

From the root folder:

```bash
npm run dev
```

* Frontend: http://localhost:3000
* Backend: http://localhost:5001

---

## Deployment

The application is deployed on AWS EC2.

### Backend

* Managed using PM2
* Runs on port 5001

### Frontend

* Built using React build
* Served on port 3000

### Access

```
http://<your-ec2-public-ip>:3000
```

---

## Testing

Automated backend tests were implemented using:

* Jest
* Supertest

### Run tests locally:

```bash
cd backend
npm test
```

### Test coverage includes:

* Authentication protection
* Unauthorized access handling
* API endpoint validation

---

## CI/CD

GitHub Actions is used to automatically run tests on:

* Push to main branch
* Pull requests

This ensures code quality and prevents breaking changes.

---

## Project Structure

```
IFN636/
│
├── backend/
│   ├── controllers/
│   ├── models/
│   ├── routes/
│   ├── middleware/
│   ├── tests/
│   └── server.js
│
├── frontend/
│   ├── components/
│   ├── pages/
│   └── App.js
│
└── .github/workflows/
```

---

## Screenshots (Assessment)

Screenshots demonstrating:

* System functionality
* CRUD operations
* Testing results
* CI/CD pipeline
* Deployment

are included in the report submission.

---

## Notes

* MongoDB Atlas is used as the database and must be accessible via network settings.
* Admin access requires a user with `"role": "admin"` in the database (so you may need to manually edit an admin account, I ran out of time to develop a "Create Admin" button).
* Ticket availability updates automatically when bookings are made or cancelled.

---

## Author

JozsefCsonti - Developed as part of IFN636 – Software Development Life Cycles.
