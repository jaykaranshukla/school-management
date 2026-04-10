# 🏫 School Management System

A simple full-stack web app to manage students and tasks.

## 🔗 Links

- **Link:** https://school-management-gamma-tan.vercel.app/

## 🔐 Admin Login

```
Email:    admin@school.com
Password: admin123
```

## ✨ Features

- Admin login with JWT authentication
- Add, edit, delete and view students
- Assign tasks to students
- Mark tasks as complete
- Protected dashboard (login required)

## 🛠️ Tech Stack

- **Frontend:** React.js, Vite, Tailwind CSS
- **Backend:** Node.js, Express.js
- **Database:** MongoDB Atlas
- **Deployment:** Vercel + Render

## ⚙️ Local Setup

```bash
# Clone the repo
git clone https://github.com/YOUR_USERNAME/school-management.git

# Backend
cd backend
npm install
npm run dev

# Frontend
cd frontend
npm install
npm run dev
```

### Backend `.env`
```
MONGO_URL=your_mongodb_connection_string
PORT=5000
JWT_SECRET=schoolsecretkey123
```

### Frontend `.env`
```
VITE_BASE_URL=http://localhost:5000/api
```
