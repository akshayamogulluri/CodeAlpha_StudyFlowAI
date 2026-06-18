# StudyFlow AI - Student Project Management Tool

StudyFlow AI is a full-stack student project management application built to help teams plan academic work, organize deadlines, assign responsibilities, and track task progress from one clean workspace. It combines authentication, project management, Kanban workflows, comments, and profile management into a responsive dashboard experience.

## Overview

Students often manage project work across chats, spreadsheets, notes, and scattered reminders. StudyFlow AI brings the core workflow into a single web app:

- Create project spaces for coursework, capstones, research, and team assignments.
- Add deadlines, descriptions, and team members.
- Break projects into tasks with priorities, assignees, due dates, and statuses.
- Move tasks through a Kanban board: To Do, In Progress, and Completed.
- Discuss task progress with comment history.
- Track project and task statistics from the dashboard.

## Features

- User registration and login with JWT authentication.
- Secure password hashing with bcrypt.
- Protected frontend routes for authenticated users.
- Professional responsive dashboard with sidebar navigation.
- Project CRUD: create, view, edit, delete, and search projects.
- Task CRUD: create, edit, delete, assign, prioritize, and set due dates.
- Drag-and-drop Kanban board for task status updates.
- Comments system for task-level discussions.
- User profile page with name, email, and avatar support.
- Statistics cards for total projects, total tasks, completed tasks, and pending tasks.
- MongoDB data modeling with separate Users, Projects, Tasks, and Comments collections.

## Tech Stack

### Frontend

- React.js
- Tailwind CSS
- React Router
- Axios
- Vite
- Lucide React icons

### Backend

- Node.js
- Express.js
- MongoDB
- Mongoose
- JWT
- bcryptjs
- dotenv
- CORS
- Morgan

## Installation

### Prerequisites

- Node.js 18 or later
- npm
- MongoDB running locally or a MongoDB Atlas connection string

### Setup

Install dependencies from the project root:

```bash
npm install
```

Create environment files if they do not already exist:

```bash
cp server/.env.example server/.env
cp client/.env.example client/.env
```

Configure the backend environment:

```env
PORT=5000
MONGO_URI=mongodb://127.0.0.1:27017/studyflow_ai
JWT_SECRET=replace_with_a_long_random_secret
CLIENT_URL=http://localhost:5173
```

Configure the frontend environment:

```env
VITE_API_URL=http://localhost:5000/api
```

Start the application:

```bash
npm run dev
```

The app will run at:

- Frontend: `http://localhost:5173`
- Backend API: `http://localhost:5000/api`
- Health check: `http://localhost:5000/api/health`

## API Summary

### Auth

- `POST /api/auth/register`
- `POST /api/auth/login`
- `GET /api/auth/me`
- `PUT /api/auth/profile`

### Projects

- `GET /api/projects`
- `GET /api/projects/stats`
- `POST /api/projects`
- `PUT /api/projects/:id`
- `DELETE /api/projects/:id`

### Tasks

- `GET /api/tasks?projectId=:projectId`
- `POST /api/tasks`
- `PUT /api/tasks/:id`
- `DELETE /api/tasks/:id`

### Comments

- `GET /api/comments/:taskId`
- `POST /api/comments/:taskId`

## Screenshots

Add screenshots to a `screenshots/` folder and reference them here.

Suggested screenshots:

```text
screenshots/login.png
screenshots/dashboard.png
screenshots/project-board.png
screenshots/task-comments.png
screenshots/profile.png
```

Example Markdown:

```md
![Dashboard](screenshots/dashboard.png)
![Kanban Board](screenshots/project-board.png)
```

## Future Scope

- AI-assisted project planning and task breakdown suggestions.
- Email or in-app deadline reminders.
- File attachments for projects and tasks.
- Real-time collaboration with Socket.IO.
- Role-based permissions for owners, editors, and viewers.
- Team invitations by email.
- Calendar view for deadlines and due dates.
- Analytics for workload, overdue tasks, and team contribution.
- Dark mode.
- Unit, integration, and end-to-end test coverage.

## Project Structure

```text
studyflow-ai/
  client/
    src/
      api/
      components/
      context/
      pages/
      utils/
  server/
    src/
      config/
      controllers/
      middleware/
      models/
      routes/
      utils/
```

## License

This project is intended for learning, academic use, and portfolio development.
