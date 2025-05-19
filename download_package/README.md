# Favorite Movies List

A full-stack web application that allows users to create, view, edit, and delete their favorite movies with ratings and posters.

![Favorite Movies List App](/screenshots/app-screenshot.png)

## Table of Contents
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Installation Guide](#installation-guide)
  - [Prerequisites](#prerequisites)
  - [Step-by-Step Setup](#step-by-step-setup)
- [MongoDB Integration](#mongodb-integration)
  - [Setting Up MongoDB](#setting-up-mongodb)
  - [Connecting the App to MongoDB](#connecting-the-app-to-mongodb)
- [Running the Application](#running-the-application)
- [Using the Application](#using-the-application)
  - [Adding a Movie](#adding-a-movie)
  - [Editing a Movie](#editing-a-movie)
  - [Deleting a Movie](#deleting-a-movie)
  - [Filtering and Sorting](#filtering-and-sorting)
- [API Documentation](#api-documentation)
- [Data Schema](#data-schema)
- [Troubleshooting](#troubleshooting)
- [Development Notes](#development-notes)

## Features

- **Create**: Add new movies with title, genre, rating (1-10), watched status, review, and poster URL
- **Read**: View your movie collection in a responsive, visually appealing grid layout
- **Update**: Edit details of existing movies
- **Delete**: Remove movies from your collection
- **Filter**: Filter movies by genre and watched/unwatched status
- **Sort**: Arrange movies by rating (high to low or low to high) or title (A-Z or Z-A)
- **Responsive Design**: Looks great on mobile, tablet, and desktop

## Tech Stack

- **Frontend:**
  - React 18 (with TypeScript)
  - TailwindCSS for styling
  - Shadcn UI components
  - React Query for data fetching and cache management
  - React Hook Form for form handling and validation

- **Backend:**
  - Node.js
  - Express.js RESTful API
  - MongoDB with Mongoose (for local deployment)
  - In-memory storage (for demo purposes)

## Installation Guide

### Prerequisites

Before installing this application, make sure you have the following installed:

1. **Node.js and npm**
   - Node.js version 16.x or newer
   - You can download it from [nodejs.org](https://nodejs.org/)
   - Verify your installation by running:
     ```bash
     node -v
     npm -v
     ```

2. **MongoDB** (if using MongoDB storage)
   - MongoDB Community Edition version 4.4 or newer
   - You can download it from [mongodb.com](https://www.mongodb.com/try/download/community)
   - Make sure the MongoDB service is running on port 27017 (default port)
   - Verify MongoDB is running with:
     ```bash
     mongosh
     ```
     This should connect to your MongoDB server

### Step-by-Step Setup

1. **Download and Extract the Code**
   - Download the project code as a ZIP file
   - Extract it to a directory of your choice

2. **Install Dependencies**
   - Open a terminal/command prompt
   - Navigate to the project directory:
     ```bash
     cd path/to/favorite-movies-list
     ```
   - Install all required packages:
     ```bash
     npm install
     ```
   - This might take a few minutes as it installs all dependencies

## MongoDB Integration

### Setting Up MongoDB

1. **Install MongoDB** (if not already installed)
   - Follow the installation instructions for your operating system from the [MongoDB Documentation](https://docs.mongodb.com/manual/installation/)

2. **Start MongoDB Service**
   - Windows:
     - MongoDB should be running as a service
     - If not, open Command Prompt as Administrator and run:
       ```bash
       net start MongoDB
       ```
   
   - macOS (with Homebrew):
     ```bash
     brew services start mongodb-community
     ```
   
   - Linux:
     ```bash
     sudo systemctl start mongod
     ```

3. **Verify MongoDB is Running**
   ```bash
   mongosh
   ```
   If you see the MongoDB shell prompt, your MongoDB server is running correctly.

### Connecting the App to MongoDB

To use MongoDB instead of the default in-memory storage:

1. **Edit server/index.ts**
   - Open the file `server/index.ts` in a text editor
   - Uncomment or add this line near the top of the file:
     ```typescript
     import "./mongodb"; // Import MongoDB connection
     ```

2. **Edit server/storage.ts**
   - Open the file `server/storage.ts` in a text editor
   - Replace the line `export const storage = new MemStorage();` at the bottom with:
     ```typescript
     // To use MongoDB storage:
     import { MongoDBStorage, initializeWithSampleData } from './mongodb-storage';
     const storage = new MongoDBStorage();
     initializeWithSampleData(storage).catch(console.error);
     export { storage };
     ```

3. **Configure MongoDB Connection** (Optional)
   - If your MongoDB is running on a different host or port, open `server/mongodb.ts`
   - Update the `MONGODB_URI` constant with your connection string

## Running the Application

1. **Start the Development Server**
   ```bash
   npm run dev
   ```

2. **Access the Application**
   - Open your web browser and navigate to:
   ```
   http://localhost:5000
   ```

3. **Stopping the Server**
   - To stop the server, press `Ctrl+C` in the terminal where it's running

## Using the Application

### Adding a Movie

1. Click the "+" button in the bottom right corner
2. Fill in the movie details:
   - Title (required)
   - Genre (required)
   - Rating (1-10)
   - Watched status (checkbox)
   - Review (optional)
   - Poster URL (optional) - URL to an image of the movie poster
3. Click "Add Movie" to save

### Editing a Movie

1. Find the movie you want to edit in the grid
2. Click the edit (pencil) icon in the movie card
3. Modify the details in the form that appears
4. Click "Save Changes" to update

### Deleting a Movie

1. Find the movie you want to delete in the grid
2. Click the delete (trash) icon in the movie card
3. Confirm deletion in the dialog that appears

### Filtering and Sorting

- Use the dropdown menus at the top of the page to:
  - Filter by genre
  - Filter by watched/unwatched status
  - Sort by rating or title
- Filters and sorts can be combined and will apply immediately

## API Documentation

The application provides a RESTful API for managing movies:

| Endpoint | Method | Purpose | Request Body | Response |
|----------|--------|---------|-------------|----------|
| `/api/movies` | GET | Get all movies | None | Array of movie objects |
| `/api/movies/:id` | GET | Get a specific movie | None | Movie object |
| `/api/movies` | POST | Create a new movie | Movie object without ID | Created movie object with ID |
| `/api/movies/:id` | PUT | Update a movie | Partial movie object | Updated movie object |
| `/api/movies/:id` | DELETE | Delete a movie | None | Status 204 (No Content) |

## Data Schema

### Movie

| Field     | Type    | Description                           | Required |
|-----------|---------|---------------------------------------|----------|
| id        | Number  | Unique identifier                     | Yes (auto-generated) |
| title     | String  | Movie title                           | Yes |
| genre     | String  | Movie genre                           | Yes |
| rating    | Number  | Rating (1-10)                         | Yes |
| watched   | Boolean | Whether the movie has been watched    | Yes (defaults to false) |
| review    | String  | Optional review text                  | No |
| posterUrl | String  | URL to movie poster image             | No |

## Troubleshooting

### Common Issues

1. **Server won't start**
   - Check if port 5000 is already in use
   - Try running with a different port: `PORT=5001 npm run dev`

2. **MongoDB connection errors**
   - Ensure MongoDB is running (`mongosh`)
   - Check the connection string in `server/mongodb.ts`
   - Verify network connectivity if using a remote MongoDB

3. **Missing dependencies**
   - Run `npm install` again to ensure all packages are installed

4. **"Module not found" errors**
   - Check for typos in import statements
   - Make sure all dependencies are installed

### Getting Help

If you encounter issues not covered here, please:
1. Check the console output for error messages
2. Search for the error message online
3. Check for typos in your code changes

## Development Notes

- The application uses an Express.js server that serves both the API and the static React frontend
- In development mode, a Vite development server is used for hot module reloading
- The frontend and backend are served from the same port (5000) to avoid CORS issues
- The React frontend is built with TypeScript for type safety