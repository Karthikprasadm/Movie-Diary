import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertMovieSchema, movieFilterSchema, movieSortSchema } from "@shared/schema";
import { z } from "zod";

export async function registerRoutes(app: Express): Promise<Server> {
  // Movies API routes
  
  // Get all movies
  app.get("/api/movies", async (req, res) => {
    try {
      const movies = await storage.getAllMovies();
      res.json(movies);
    } catch (error) {
      res.status(500).json({ message: "Error fetching movies" });
    }
  });
  
  // Get a specific movie
  app.get("/api/movies/:id", async (req, res) => {
    try {
      const id = req.params.id;
      if (!id) {
        return res.status(400).json({ message: "Invalid movie ID" });
      }
      const movie = await storage.getMovie(id);
      if (!movie) {
        return res.status(404).json({ message: "Movie not found" });
      }
      res.json(movie);
    } catch (error) {
      res.status(500).json({ message: "Error fetching movie" });
    }
  });
  
  // Create a new movie
  app.post("/api/movies", async (req, res) => {
    try {
      const movieData = insertMovieSchema.parse(req.body);
      const newMovie = await storage.createMovie(movieData);
      res.status(201).json(newMovie);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid movie data", errors: error.errors });
      }
      res.status(500).json({ message: "Error creating movie" });
    }
  });
  
  // Update a movie
  app.put("/api/movies/:id", async (req, res) => {
    try {
      const id = req.params.id;
      if (!id) {
        return res.status(400).json({ message: "Invalid movie ID" });
      }
      const movieData = insertMovieSchema.partial().parse(req.body);
      const updatedMovie = await storage.updateMovie(id, movieData);
      if (!updatedMovie) {
        return res.status(404).json({ message: "Movie not found" });
      }
      res.json(updatedMovie);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid movie data", errors: error.errors });
      }
      res.status(500).json({ message: "Error updating movie" });
    }
  });
  
  // Delete a movie
  app.delete("/api/movies/:id", async (req, res) => {
    try {
      const id = req.params.id;
      if (!id) {
        return res.status(400).json({ message: "Invalid movie ID" });
      }
      const deleted = await storage.deleteMovie(id);
      if (!deleted) {
        return res.status(404).json({ message: "Movie not found" });
      }
      res.status(204).end();
    } catch (error) {
      res.status(500).json({ message: "Error deleting movie" });
    }
  });

  const httpServer = createServer(app);

  return httpServer;
}
