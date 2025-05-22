# 🎬 Favorite Movies List

A modern, full-stack web application to manage your favorite movies. Add, view, edit, and delete movies with ratings, genres, reviews, and posters. Built with React, Express, and MongoDB.

![App Screenshot](/screenshots/app-screenshot.png)

---

## 📑 Table of Contents

- [Features](#features)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Installation & Setup](#installation--setup)
  - [Prerequisites](#prerequisites)
  - [Step-by-Step Setup](#step-by-step-setup)
- [MongoDB Integration](#mongodb-integration)
  - [Replica Set Setup](#replica-set-setup)
  - [Connecting the App to MongoDB](#connecting-the-app-to-mongodb)
- [Running the Application](#running-the-application)
- [Usage Guide](#usage-guide)
  - [Adding, Editing, Deleting Movies](#adding-editing-deleting-movies)
  - [Filtering and Sorting](#filtering-and-sorting)
- [API Documentation](#api-documentation)
- [Data Schema](#data-schema)
- [Troubleshooting](#troubleshooting)
- [Development Notes](#development-notes)
- [License](#license)

---

## 🚀 Features

- **Create**: Add new movies with title, genre, rating (1-10), watched status, review, and poster URL.
- **Read**: View your movie collection in a responsive, visually appealing grid.
- **Update**: Edit details of existing movies.
- **Delete**: Remove movies from your collection.
- **Filter & Sort**: Filter by genre, watched status; sort by rating or title.
- **Real-time Updates**: UI updates instantly on changes (WebSocket-powered).
- **Responsive Design**: Works on mobile, tablet, and desktop.
- **Accessible**: Follows accessibility best practices.

---

## 🛠 Tech Stack

**Frontend:**
- React 18 (TypeScript)
- Vite
- TailwindCSS
- Shadcn UI
- React Query
- React Hook Form

**Backend:**
- Node.js
- Express.js
- MongoDB (with Mongoose)
- WebSocket (ws)
- Zod (validation)

**Dev Tools:**
- TypeScript
- Vite
- tsx
- Drizzle ORM (optional)
- ESLint, Prettier

---

## 📁 Project Structure

```
.
├── client/              # React frontend (Vite, TypeScript)
├── server/              # Express backend, API, MongoDB logic
├── shared/              # Shared types and validation schemas
├── attached_assets/     # Static assets (images, etc.)
├── .env                 # Environment variables
├── package.json         # Project scripts and dependencies
├── vite.config.ts       # Vite configuration (with API proxy)
└── README.md            # This file
```

---

## ⚡ Installation & Setup

### Prerequisites

- **Node.js** (v16+): [Download](https://nodejs.org/)
- **npm** (comes with Node.js)
- **MongoDB** (v4.4+): [Download](https://www.mongodb.com/try/download/community)
  - For real-time features, MongoDB must run as a **replica set** (see below).

### Step-by-Step Setup

1. **Clone or Download the Repository**
   ```bash
   git clone <repo-url>
   cd MovieTrackerApp
   ```

2. **Install Dependencies**
   ```bash
   npm install
   ```

---

## 🍃 MongoDB Integration

### Replica Set Setup

For real-time updates (change streams), MongoDB must run as a replica set.

**On Windows:**
- Use the provided script:
  ```bash
  powershell -ExecutionPolicy Bypass -File ./start-mongo.ps1
  ```
- If this is your first time, initialize the replica set:
  ```bash
  mongosh
  rs.initiate()
  ```

**On macOS/Linux:**
- Start MongoDB with replica set:
  ```bash
  mongod --replSet rs0 --dbpath <your-db-path>
  ```
- Then in another terminal:
  ```bash
  mongosh
  rs.initiate()
  ```

### Connecting the App to MongoDB

- By default, the app connects to `mongodb://localhost:27017/moviesDB`.
- To use a different URI, edit `server/mongodb.ts` and update `MONGODB_URI`.

---

## 🏃 Running the Application

1. **Start MongoDB** (as a replica set, see above)
2. **Start the Backend Server**
   ```bash
   npm run dev
   ```
   - Runs Express API on [http://localhost:5000](http://localhost:5000)
3. **Start the Frontend Client** (in a new terminal)
   ```bash
   npm run client
   ```
   - Runs React app on [http://localhost:5173](http://localhost:5173)
4. **Access the App**
   - Open [http://localhost:5173](http://localhost:5173) in your browser.

---

## 🧑‍💻 Usage Guide

### Adding, Editing, Deleting Movies
- Click the **+** button to add a movie.
- Use the edit (✏️) and delete (🗑️) icons on each movie card.
- Fill in the form fields (title, genre, rating, etc.) and submit.

### Filtering and Sorting
- Use the dropdowns at the top to filter by genre or watched status.
- Sort by rating or title.
- Combine filters and sorts for custom views.

---

## 📡 API Documentation

| Endpoint           | Method | Description                | Request Body         | Response                |
|--------------------|--------|----------------------------|----------------------|-------------------------|
| `/api/movies`      | GET    | Get all movies             | None                 | Array of movie objects  |
| `/api/movies/:id`  | GET    | Get a specific movie       | None                 | Movie object            |
| `/api/movies`      | POST   | Create a new movie         | Movie object         | Created movie object    |
| `/api/movies/:id`  | PUT    | Update a movie             | Partial movie object | Updated movie object    |
| `/api/movies/:id`  | DELETE | Delete a movie             | None                 | Status 204 (No Content) |

---

## 🗃️ Data Schema

### Movie
| Field     | Type    | Description                           | Required |
|-----------|---------|---------------------------------------|----------|
| id        | String  | Unique identifier (MongoDB ObjectId)   | Yes      |
| title     | String  | Movie title                           | Yes      |
| genre     | String  | Movie genre                           | Yes      |
| rating    | Number  | Rating (1-10)                         | Yes      |
| watched   | Boolean | Whether the movie has been watched    | Yes      |
| review    | String  | Optional review text                  | No       |
| posterUrl | String  | URL to movie poster image             | No       |

---

## 🛠️ Troubleshooting

- **Server won't start:**
  - Check if port 5000 is already in use.
  - Try a different port: `PORT=5001 npm run dev`
- **MongoDB connection errors:**
  - Ensure MongoDB is running as a replica set (`mongosh`, `rs.status()`).
  - Check the connection string in `server/mongodb.ts`.
- **Frontend can't reach backend:**
  - Make sure both servers are running.
  - Check the Vite proxy in `vite.config.ts`.
- **Missing dependencies:**
  - Run `npm install` again.
- **TypeScript or linter errors:**
  - Run `npx tsc --noEmit` and fix any reported issues.

---

## 📝 Development Notes

- Express serves the API and (in production) the static frontend.
- In development, Vite serves the frontend with hot reload and proxies API requests.
- MongoDB change streams enable real-time UI updates (requires replica set).
- All movie IDs are MongoDB ObjectId strings.
- The codebase is fully typed with TypeScript.

---

## 📄 License

This project is licensed under the MIT License.