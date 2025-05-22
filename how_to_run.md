# 🏃 How to Run Favorite Movies List Application

This guide explains how to run the full-stack Favorite Movies List app, including starting MongoDB as a replica set, running the backend (API), frontend (React), and ensuring everything is connected.

---

## 1. Prerequisites

- **Node.js** (v16+): [Download](https://nodejs.org/)
- **npm** (comes with Node.js)
- **MongoDB** (v4.4+): [Download](https://www.mongodb.com/try/download/community)
  - For real-time features, MongoDB must run as a **replica set**.

---

## 2. Install Dependencies

Open a terminal in your project directory and run:
```bash
npm install
```

---

## 3. Start MongoDB as a Replica Set

### On Windows
1. **Stop any running MongoDB service** (if running as a Windows service):
   ```bash
   net stop MongoDB
   ```
2. **Start MongoDB as a replica set** using the provided script:
   ```bash
   powershell -ExecutionPolicy Bypass -File ./start-mongo.ps1
   ```
3. **Initialize the replica set** (first time only):
   - Open a new terminal and run:
     ```bash
     mongosh
     rs.initiate()
     ```

### On macOS/Linux
1. **Start MongoDB as a replica set** (replace `<your-db-path>` with your data directory):
   ```bash
   mongod --replSet rs0 --dbpath <your-db-path>
   ```
2. **Initialize the replica set** (first time only):
   - In another terminal:
     ```bash
     mongosh
     rs.initiate()
     ```

**Tip:**
- You should see your prompt change to `rs0:PRIMARY>` after `rs.initiate()`.
- To check replica set status: `rs.status()`

---

## 4. Start the Backend (API Server)

In your project directory, run:
```bash
npm run dev
```
- This starts the Express API at [http://localhost:5000](http://localhost:5000)
- The backend connects to MongoDB at `mongodb://localhost:27017/moviesDB` by default.
- To use a different URI, edit `server/mongodb.ts` and update `MONGODB_URI`.

---

## 5. Start the Frontend (React Client)

Open a **new terminal** in your project directory and run:
```bash
npm run client
```
- This starts the React app at [http://localhost:5173](http://localhost:5173)
- The frontend proxies API requests to the backend (see `vite.config.ts`).

---

## 6. Access the Application

- Open your browser and go to: [http://localhost:5173](http://localhost:5173)
- You should be able to add, edit, and delete movies. All changes are saved in MongoDB.

---

## 7. Stopping the Servers

- To stop any server (backend, frontend, or MongoDB), press `Ctrl+C` in the terminal where it is running.

---

## 8. Troubleshooting

- **Backend not connecting to MongoDB?**
  - Make sure MongoDB is running as a replica set.
  - Check the connection string in `server/mongodb.ts`.
- **Frontend can't reach backend?**
  - Make sure both backend and frontend are running.
  - Check the proxy in `vite.config.ts`.
- **Port already in use?**
  - Use a different port: `PORT=5001 npm run dev`
- **TypeScript or linter errors?**
  - Run `npx tsc --noEmit` and fix any reported issues.
- **MongoDB Compass connection:**
  - Use: `mongodb://localhost:27017/?replicaSet=rs0`

---

## 9. Useful Commands

- **Install dependencies:**
  ```bash
  npm install
  ```
- **Start backend:**
  ```bash
  npm run dev
  ```
- **Start frontend:**
  ```bash
  npm run client
  ```
- **Start MongoDB replica set (Windows):**
  ```bash
  powershell -ExecutionPolicy Bypass -File ./start-mongo.ps1
  ```
- **Initialize replica set:**
  ```bash
  mongosh
  rs.initiate()
  ```
- **Check MongoDB status:**
  ```bash
  mongosh
  rs.status()
  ```

---

## 10. Notes

- **You must keep MongoDB, backend, and frontend running for the app to work fully.**
- All movie IDs are MongoDB ObjectId strings.
- For real-time updates, MongoDB must be a replica set.
- If you change code, restart the relevant process or use the dev scripts for hot reload. 