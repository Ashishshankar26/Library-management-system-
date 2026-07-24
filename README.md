# Library Management System - CipherSchools Project 2

A complete Library Management System built using the **MERN Stack** (MongoDB, Express.js, React, Node.js).

## Features
- **User Authentication & Authorization**: JWT token-based auth with Role-Based Access Control (Admin vs Member).
- **Book Management (CRUD)**: Create, Read, Update, Delete books in catalog with ISBN validation, category tagging, and image cover support.
- **Book Issue & Return Workflow**: Borrow books for a 14-day loan period, automatic inventory decrement/increment, return processing, and overdue fine calculation.
- **Admin Control Center**: Monitor inventory counts, active loans, and book distributions.
- **Interactive UI**: Custom Glassmorphism UI, search, category filter, responsive layout, and toast alerts.

---

## Folder Structure
```
library-management-system/
├── backend/
│   ├── config/db.js              # Mongoose Connection
│   ├── middleware/auth.js        # JWT Auth & Admin Middleware
│   ├── models/                   # Schemas: User, Book, IssueRecord
│   ├── controllers/              # Business logic: Auth, Books, Issues
│   ├── routes/                   # REST Routes: /api/auth, /api/books, /api/issues
│   ├── server.js                 # Express Entrypoint
│   └── package.json
└── frontend/
    ├── src/
    │   ├── services/api.js       # API Client with LocalStorage Fallback
    │   ├── App.jsx               # Main React SPA
    │   ├── main.jsx
    │   └── index.css             # Glassmorphism Design System
    ├── index.html
    ├── vite.config.js
    └── package.json
```

---

## How to Run

### 1. Run Backend API Server
```bash
cd backend
npm install
npm run dev # Runs on http://localhost:5001
```

### 2. Run Frontend Web App
```bash
cd frontend
npm install
npm run dev # Runs on http://localhost:3001
```
