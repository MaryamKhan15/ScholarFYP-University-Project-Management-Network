# AI-Powered Smart FYP Management System

An intelligent, full-stack web application designed for universities to manage, monitor, and evaluate Final Year Projects (FYPs). Built with **React 18 + Vite + Tailwind CSS** on the frontend, and **Node.js + Express + MongoDB** on the backend.

---

## 🌟 Key Features

### 1. 🎓 Student Journey
- **Student Dashboard**: Live tracking of proposal approval state, active project sprint, completion percentage, and supervisor feedback.
- **AI Proposal Assistant & Submission**:
  - Live AI Pre-Check with clarity scoring (0-100), strength detection, and suggested improvements.
  - **Duplicate Topic Detection**: Real-time checking against past university project databases to avoid redundant topics.
  - Multi-author team member registration (up to 3 students).
- **Proposal Status & Revision Desk**: Real-time supervisor comments timeline and revision resubmission workflow ($v1 \rightarrow v2$).
- **My FYP Project & Kanban Board**:
  - Interactive Task Board (To Do, In Progress, Completed) with task creation and priority flags.
- **Milestones & Timeline**: 7-phase academic milestones synchronized with AI recommendations.
- **Weekly Progress Tracking**: Submit weekly accomplishments, hurdles faced, next sprint targets, and receive supervisor feedback.
- **Document Repository**: Centralized file manager with versioning for SRS, Design Documents, Thesis Books, and Presentation Slides.
- **Meeting Scheduler**: Book consultations with supervisors, agenda tracking, and status updates.

### 2. 👨‍🏫 Supervisor Desk
- **Supervisor Dashboard**: High-level workload overview of assigned students, pending proposals, and project health.
- **Proposal Review Desk**: Side-by-side proposal inspection, AI clarity evaluation, duplicate topic similarity analysis, and one-click actions:
  - `Approve Proposal` (automatically spawns active project & generates milestones).
  - `Request Changes` (with remarks).
  - `Reject Proposal`.
- **Progress Monitoring**: Review and grade student weekly progress logs with ratings and direct advice.
- **Advisory Meetings**: Schedule, review agendas, and mark meeting minutes.

### 3. 🏛️ Admin / FYP Coordinator
- **Institutional Analytics Dashboard**:
  - Real-time Recharts data visualization: Proposal status breakdown, department stats, and overall progress percentage.
- **Supervisor Workload Distribution**: Balance assigned groups across faculty members.
- **User Directory**: Enrolled students, faculty members, and coordinators.
- **Project Re-assignment**: Reassign supervisors to project groups when required.

---

## 🚀 Quick Start Guide

### Prerequisites
- Node.js (v18 or higher)
- Local MongoDB or MongoDB Atlas URI

### 1. Backend Server Setup
```bash
cd server
npm install
npm run dev # or node server.js
```
The server will run on `http://localhost:5000`.

*(Optional: Run `node seed.js` to populate realistic sample data into MongoDB for immediate demonstration).*

### 2. Frontend Client Setup
```bash
cd client
npm install
npm run dev
```
Open `http://localhost:5173` in your browser.

---

## 🔑 Demo Accounts (Ready to Test)

| Role | Email | Password |
|---|---|---|
| **Student** | `student@fyp.edu.pk` | `studentpassword123` |
| **Supervisor** | `ayesha@fyp.edu.pk` | `supervisorpassword123` |
| **Admin / Coordinator** | `admin@fyp.edu.pk` | `adminpassword123` |

*(You can also register a brand new account with any role directly from the Register page).*

---

## 🧠 AI Layer Architecture
- **Clarity Scoring Heuristics**: Analyzes problem statements, technical feasibility, and SMART objectives.
- **Duplicate Topic Detector**: Jaccard and n-gram similarity matching across registered university titles and descriptions.
- **Milestone Generator**: Generates domain-tailored 7-phase academic timelines.
- Designed to function seamlessly offline with built-in heuristic NLP engines, while also ready for Gemini / OpenAI API integration.
