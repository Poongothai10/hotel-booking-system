# 🏨 Online Hotel Room Booking Management System

A production-ready full-stack web application with strict role verification, real-time availability tracking, and integrated cleaning and security workflows.

## 🧱 Tech Stack
- **Frontend:** React.js, Tailwind CSS v3, Axios, React Router v6
- **Backend:** Node.js, Express.js
- **Database:** MongoDB Atlas (Mongoose ORM)
- **Authentication:** JWT (JSON Web Tokens)
- **Security:** Helmet, `express-rate-limit`, `xss-clean`
- **File Upload:** Multer (`/uploads`)

## ▶️ Run Instructions

### 1. Database
This project utilizes MongoDB Atlas via Mongoose. No active migrations are required! The schemas will be structurally established upon your first data insertion.
Ensure your `.env` contains:
`MONGO_URI="mongodb+srv://poongothai:poongothai%4010@cluster0.l62vzid.mongodb.net/hotel_booking?retryWrites=true&w=majority&appName=Cluster0"`

### 2. Backend Server
Open a terminal and execute the following:
```bash
cd backend
npm install
npm run dev
```

### 3. Frontend Client
Open a secondary terminal and execute:
```bash
cd frontend
npm install
npm run dev
```

Navigate to `http://localhost:5173` to test the Web App!
