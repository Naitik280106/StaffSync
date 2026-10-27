# StaffSync — HR Management System

[![Live Demo](https://img.shields.io/badge/Live%20Demo-staff--sync--delta.vercel.app-brightgreen?style=for-the-badge&logo=vercel)](https://staff-sync-delta.vercel.app/)
[![Backend API](https://img.shields.io/badge/Backend%20API-Render-46E3B7?style=for-the-badge&logo=render)](https://staffsync-uw4p.onrender.com/api/health)
[![Database](https://img.shields.io/badge/Database-MongoDB%20Atlas-47A248?style=for-the-badge&logo=mongodb)](https://www.mongodb.com/atlas)

A full-stack MERN Human Resource Management System built by [Naitik](https://github.com/Naitik280106).

### 🌐 Live Deployment
- **Frontend (Vercel):** [https://staff-sync-delta.vercel.app/](https://staff-sync-delta.vercel.app/)
- **Backend API (Render):** [https://staffsync-uw4p.onrender.com](https://staffsync-uw4p.onrender.com)
- **API Health Check:** [https://staffsync-uw4p.onrender.com/api/health](https://staffsync-uw4p.onrender.com/api/health)

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React + Vite + Bootstrap |
| Backend | Node.js + Express |
| Database | MongoDB Atlas + Mongoose |
| HTTP Client | Axios |

## Project Structure

```
StaffSync/
├── client/                          # React frontend (Vite)
│   ├── src/
│   │   ├── api/axiosConfig.js       # Axios instance (reads VITE_API_URL)
│   │   ├── components/
│   │   │   ├── Sidebar.jsx          # Sidebar navigation (Dashboard, Employees, Attendance, Leaves, Announcements)
│   │   │   ├── Dashboard.jsx        # Stats, department breakdown, latest announcements
│   │   │   ├── Employees.jsx        # Employee management table + search + filters
│   │   │   ├── EmployeeForm.jsx     # Add/Edit employee modal
│   │   │   ├── EmployeeDetail.jsx   # Detailed employee profile view
│   │   │   ├── ConfirmModal.jsx     # Delete confirmation dialog
│   │   │   ├── Attendance.jsx       # Daily attendance marking, history, and status filtering
│   │   │   ├── Leaves.jsx           # Leave requests, date validation, approve/reject workflow
│   │   │   └── Announcements.jsx    # Company-wide announcements management
│   │   ├── App.jsx                  # Main application routing and navigation state
│   │   ├── index.css                # Global and custom styles
│   │   └── main.jsx                 # Client entry point
│   ├── .env                         # VITE_API_URL (git ignored)
│   └── .env.example
├── server/
│   ├── controllers/
│   │   ├── employeeController.js    # Employee CRUD logic
│   │   ├── attendanceController.js  # Attendance mark/view/filter/delete
│   │   ├── leaveController.js       # Leave application, review/approval logic
│   │   └── announcementController.js# Announcement CRUD logic
│   ├── models/
│   │   ├── Employee.js              # Employee Mongoose schema
│   │   ├── Attendance.js            # Attendance schema with unique constraint per day
│   │   ├── Leave.js                 # Leave request schema with status tracking
│   │   └── Announcement.js          # Announcement schema
│   ├── routes/
│   │   ├── employeeRoutes.js        # /api/employees routes
│   │   ├── attendanceRoutes.js      # /api/attendance routes
│   │   ├── leaveRoutes.js           # /api/leaves routes
│   │   └── announcementRoutes.js    # /api/announcements routes
│   ├── index.js                     # Express server entry point & MongoDB Atlas connection
│   ├── .env                         # Environment variables (git ignored)
│   └── .env.example
├── .gitignore
└── README.md
```

## Quick Start

### Prerequisites
- Node.js v18+
- MongoDB Atlas cluster URI or local MongoDB instance

### 1. Clone the repository
```bash
git clone https://github.com/Naitik280106/StaffSync.git
cd StaffSync
```

### 2. Configure the Backend
```bash
cd server
copy .env.example .env
```
In `server/.env`:
```env
PORT=5000
MONGO_URI=mongodb+srv://<username>:<password>@<cluster-url>/staffsync?retryWrites=true&w=majority
```

### 3. Run the Backend
```bash
cd server
npm install
npm run dev
```
Backend Server → **http://localhost:5000**  
Health Check → **http://localhost:5000/api/health**

### 4. Configure & Run Frontend
```bash
cd client
npm install
npm run dev
```
Frontend App → **http://localhost:5173**

---

## API Endpoints

Base URL: `http://localhost:5000/api`

### Health Check
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/health` | Server and MongoDB Atlas live connection status |

### Employees
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/employees` | List all employees |
| GET | `/employees/:id` | Get single employee details |
| POST | `/employees` | Create employee |
| PUT | `/employees/:id` | Update employee |
| DELETE | `/employees/:id` | Delete employee |

### Attendance
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/attendance?date=YYYY-MM-DD&employee=id` | Get attendance records (with filters) |
| POST | `/attendance` | Mark employee attendance (Present, Absent, On Leave) |
| PUT | `/attendance/:id` | Update attendance status |
| DELETE | `/attendance/:id` | Delete attendance record |

### Leave Management
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/leaves?employee=id&status=Pending` | Get leave requests (with filters) |
| POST | `/leaves` | Submit new leave request |
| PATCH | `/leaves/:id/status` | Approve or Reject leave request |
| DELETE | `/leaves/:id` | Delete leave request |

### Announcements
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/announcements` | Get all announcements |
| POST | `/announcements` | Create announcement |
| PUT | `/announcements/:id` | Update announcement |
| DELETE | `/announcements/:id` | Delete announcement |

---

## Key Features

1. **Dashboard**
   - Live metrics: Total Employees, Department count, Active Leaves, Total Announcements.
   - Department breakdown distribution cards.
   - Recent hires list and latest company announcements.

2. **Employee Management**
   - Full CRUD operations with instant UI feedback.
   - Search across name, email, department, and job title.
   - Department filtering.
   - Comprehensive employee profile modal.
   - Safe delete with confirmation dialog.

3. **Attendance Management**
   - Mark employee status as `Present`, `Absent`, or `On Leave`.
   - Built-in duplicate prevention for the same employee on the same date.
   - Interactive date and employee filtering.
   - Color-coded attendance status badges.

4. **Leave Management**
   - Leave application with start/end date validation and day count calculation.
   - Types: Annual, Sick, Casual, Maternity, Paternity, Unpaid.
   - HR Approval / Rejection workflow with optional review remarks.
   - Status tracking (`Pending`, `Approved`, `Rejected`).

5. **Company Announcements**
   - HR announcement publishing with title, message, and publication date.
   - Edit, delete, and real-time dashboard display.

6. **Database Persistence**
   - Fully connected and verified with MongoDB Atlas.
   - Mongoose data models with validation and constraints.

---

## Deployment Guide (Online Production)

### 1. MongoDB Atlas Setup
1. In your MongoDB Atlas Dashboard, go to **Network Access** under **Security**.
2. Click **Add IP Address** and select **Allow Access from Anywhere (`0.0.0.0/0`)** so cloud hosts like Render can connect.
3. In **Database Access**, verify your database user has read/write privileges.
4. Copy your connection string from **Database → Connect → Drivers**.

---

### 2. Backend Deployment on Render
1. Go to [Render Dashboard](https://dashboard.render.com/) and click **New → Web Service**.
2. Connect your GitHub repository: `https://github.com/Naitik280106/StaffSync`.
3. Configure the service settings:
   - **Name:** `staffsync-api` (or your choice)
   - **Region:** Any close region (e.g., Oregon, Frankfurt, Singapore)
   - **Root Directory:** `server`
   - **Runtime:** `Node`
   - **Build Command:** `npm install`
   - **Start Command:** `npm start`
4. Under **Environment Variables**, add:
   - `MONGO_URI`: `mongodb+srv://<username>:<password>@<cluster>.mongodb.net/staffsync?retryWrites=true&w=majority`
   - `CLIENT_URL`: `https://<your-vercel-app-name>.vercel.app` *(Optional, can be added after frontend deployment)*
5. Click **Deploy Web Service**.
6. When deployment finishes, copy your Render live service URL:  
   `https://staffsync-uw4p.onrender.com`  
   Test health: `https://staffsync-uw4p.onrender.com/api/health`

---

### 3. Frontend Deployment on Vercel
1. Go to [Vercel Dashboard](https://vercel.com/dashboard) and click **Add New → Project**.
2. Import the `Naitik280106/StaffSync` repository.
3. Configure project settings:
   - **Framework Preset:** `Vite`
   - **Root Directory:** Click Edit and select `client`
   - **Build Command:** `npm run build` *(default)*
   - **Output Directory:** `dist` *(default)*
   - **Install Command:** `npm install` *(default)*
4. Under **Environment Variables**, add:
   - `VITE_API_URL`: `https://staffsync-uw4p.onrender.com/api`
5. Click **Deploy**.
6. Once deployed, open your live Vercel URL: [https://staff-sync-delta.vercel.app/](https://staff-sync-delta.vercel.app/).
7. *(Optional Polish)*: In Render, update the `CLIENT_URL` environment variable with `https://staff-sync-delta.vercel.app` to restrict CORS to your production frontend.

