# Favorite Movies List

A full-stack web application that allows users to create, view, edit, and delete their favorite movies with ratings and posters.

## Features

- Add movies with title, genre, rating, watched status, review, and poster URL
- View your movie collection in a responsive grid layout
- Edit and delete existing movies
- Filter movies by genre and watched status
- Sort movies by rating (high to low or low to high) or title (A-Z or Z-A)

## Tech Stack

- **Frontend:** React, TypeScript, Tailwind CSS, Shadcn UI components
- **Backend:** Node.js, Express.js
- **Database:** MongoDB with Mongoose (local)

## Running Locally

### Prerequisites

- Node.js (v16 or newer)
- MongoDB installed and running on your local machine

### Setup Instructions

1. Clone the repository:
   ```
   git clone <repository-url>
   cd favorite-movies-list
   ```

2. Install dependencies:
   ```
   npm install
   ```

3. Make sure MongoDB is running on your local machine:
   - MongoDB should be accessible at `mongodb://localhost:27017`
   - The application will automatically create a database named `favorite-movies`

4. To use MongoDB instead of in-memory storage:
   - Open `server/index.ts` 
   - Uncomment the line: `import "./mongodb";`
   - Open `server/storage.ts`
   - Replace the export line at the bottom with:
     ```typescript
     // To use MongoDB storage:
     import { MongoDBStorage, initializeWithSampleData } from './mongodb-storage';
     const storage = new MongoDBStorage();
     initializeWithSampleData(storage).catch(console.error);
     export { storage };
     ```

5. Start the application:
   ```
   npm run dev
   ```

6. Open your browser and navigate to:
   ```
   http://localhost:5000
   ```

## API Endpoints

- `GET /api/movies` - Get all movies
- `GET /api/movies/:id` - Get a specific movie
- `POST /api/movies` - Create a new movie
- `PUT /api/movies/:id` - Update a movie
- `DELETE /api/movies/:id` - Delete a movie

## Data Schema

### Movie

| Field     | Type    | Description                           |
|-----------|---------|---------------------------------------|
| id        | Number  | Unique identifier                     |
| title     | String  | Movie title                           |
| genre     | String  | Movie genre                           |
| rating    | Number  | Rating (1-10)                         |
| watched   | Boolean | Whether the movie has been watched    |
| review    | String  | Optional review text                  |
| posterUrl | String  | URL to movie poster image             |