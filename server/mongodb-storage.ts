import { type Movie, type InsertMovie, type User, type InsertUser } from "@shared/schema";
import { MovieModel, UserModel } from "./mongodb";
import { IStorage } from "./storage";
import mongoose, { Types } from "mongoose";

/**
 * MongoDB Storage implementation with real-time synchronization features
 * This implementation ensures that any changes made in the application
 * immediately reflect in MongoDB and vice versa.
 */
export class MongoDBStorage implements IStorage {
  // Cache objects for improved performance and offline capabilities
  private movieCache: Map<string, Movie> = new Map();
  private userCache: Map<string, User> = new Map();
  
  constructor() {
    // Only populate caches after connection is established
    mongoose.connection.once('connected', () => {
      this.populateCaches().catch(err => {
        console.error("Error populating caches:", err);
      });
      this.setupChangeStreams();
    });
  }
  
  /**
   * Sets up MongoDB change streams to listen for real-time updates
   * This ensures that any changes made directly to the database are
   * immediately reflected in the application
   */
  private async setupChangeStreams() {
    try {
      // Only set up change streams if MongoDB connection is ready
      await mongoose.connection.asPromise();
      // Check if the server is a replica set
      if (!mongoose.connection.db) {
        console.warn("MongoDB connection.db is undefined. Skipping change streams.");
        return;
      }
      const admin = mongoose.connection.db.admin();
      const status = await admin.replSetGetStatus().catch(() => ({}));
      if (!(status as any).setName) {
        console.warn("MongoDB is not running as a replica set. Change streams are disabled.");
        return;
      }
      // Watch movies collection for changes
      const movieStream = MovieModel.watch([], { fullDocument: 'updateLookup' });
      movieStream.on('change', async (change) => {
        try {
          console.log(`Detected change in movies collection:`, change.operationType);
          if (change.operationType === 'insert' || change.operationType === 'update' || change.operationType === 'replace') {
            const doc = change.fullDocument;
            if (doc) {
              const id = doc._id.toString();
              const movie = { 
                ...doc, 
                id,
                _id: undefined 
              } as unknown as Movie;
              // Update cache
              this.movieCache.set(id, movie);
              console.log(`Movie cache updated for: ${movie.title}`);
            }
          } else if (change.operationType === 'delete' && change.documentKey._id) {
            const id = change.documentKey._id.toString();
            // Remove from cache
            this.movieCache.delete(id);
            console.log(`Movie removed from cache with ID: ${id}`);
          }
        } catch (error) {
          console.error("Error processing movie change stream:", error);
        }
      });
      console.log("MongoDB change streams set up successfully");
    } catch (error) {
      console.error("Error setting up change streams:", error);
      console.log("Change streams may not be available in your MongoDB version");
      console.log("The application will still work but real-time updates from external sources may be delayed");
    }
  }
  
  /**
   * Populates the internal caches with data from MongoDB
   * This is called on startup to ensure the application has the latest data
   */
  private async populateCaches(): Promise<void> {
    try {
      // Populate movie cache
      const movies = await MovieModel.find().lean();
      movies.forEach(movie => {
        const id = movie._id.toString();
        const movieObj = { 
          ...movie, 
          id,
          _id: undefined 
        } as unknown as Movie;
        this.movieCache.set(id, movieObj);
      });
      
      console.log(`Populated movie cache with ${movies.length} movies`);
    } catch (error) {
      console.error("Error populating caches:", error);
    }
  }

  /**
   * User-related methods
   */
  async getUser(id: string): Promise<User | undefined> {
    try {
      // Check cache first
      if (this.userCache.has(id)) {
        return this.userCache.get(id);
      }
      
      // Fall back to database
      const user = await UserModel.findById(id).lean();
      if (!user) return undefined;
      
      const userObj = { 
        ...user, 
        id: String(user._id),
        _id: undefined 
      } as unknown as User;
      
      // Update cache
      this.userCache.set(String(userObj.id), userObj);
      
      return userObj;
    } catch (error) {
      console.error("Error getting user:", error);
      return undefined;
    }
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    try {
      // Try to find in cache first (more efficient for repeated lookups)
      for (const user of Array.from(this.userCache.values())) {
        if (user.username === username) {
          return user;
        }
      }
      
      // Fall back to database
      const user = await UserModel.findOne({ username }).lean();
      if (!user) return undefined;
      
      const userObj = { 
        ...user, 
        id: String(user._id),
        _id: undefined 
      } as unknown as User;
      
      // Update cache
      this.userCache.set(String(userObj.id), userObj);
      
      return userObj;
    } catch (error) {
      console.error("Error getting user by username:", error);
      return undefined;
    }
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    try {
      // Create in database first
      const newUser = await UserModel.create(insertUser);
      
      const id = (newUser._id as Types.ObjectId).toString();
      const userObj = { 
        ...newUser.toObject(), 
        id,
        _id: undefined 
      } as unknown as User;
      
      // Update cache
      this.userCache.set(String(userObj.id), userObj);
      
      return userObj;
    } catch (error) {
      console.error("Error creating user:", error);
      throw error;
    }
  }
  
  /**
   * Movie-related methods with real-time synchronization
   */
  async getAllMovies(): Promise<Movie[]> {
    try {
      // Check if cache is populated
      if (this.movieCache.size > 0) {
        console.log(`Returning ${this.movieCache.size} movies from cache`);
        return Array.from(this.movieCache.values());
      }
      
      // If cache is empty, fetch from database and populate cache
      const movies = await MovieModel.find().lean();
      
      const result = movies.map(movie => {
        const id = movie._id.toString();
        const movieObj = { 
          ...movie, 
          id,
          _id: undefined 
        } as unknown as Movie;
        
        // Update cache
        this.movieCache.set(id, movieObj);
        
        return movieObj;
      });
      
      console.log(`Populated movie cache with ${movies.length} movies`);
      return result;
    } catch (error) {
      console.error("Error getting all movies:", error);
      return [];
    }
  }

  async getMovie(id: string): Promise<Movie | undefined> {
    try {
      // Check cache first for better performance
      if (this.movieCache.has(id)) {
        return this.movieCache.get(id);
      }
      // Fall back to database
      const movie = await MovieModel.findById(id).lean();
      if (!movie) return undefined;
      const movieObj = {
        ...movie,
        id: movie._id.toString(),
        _id: undefined
      } as unknown as Movie;
      // Update cache
      this.movieCache.set(id, movieObj);
      return movieObj;
    } catch (error) {
      console.error("Error getting movie:", error);
      return undefined;
    }
  }

  async createMovie(insertMovie: InsertMovie): Promise<Movie> {
    try {
      // Create in database first to ensure data persistence
      const newMovie = await MovieModel.create(insertMovie);
      const id = (newMovie._id as Types.ObjectId).toString();
      const movieObj = {
        ...newMovie.toObject(),
        id,
        _id: undefined
      } as unknown as Movie;
      // Update cache immediately for instant access
      this.movieCache.set(id, movieObj);
      console.log(`Movie created and added to cache: ${movieObj.title}`);
      return movieObj;
    } catch (error) {
      console.error("Error creating movie:", error);
      throw error;
    }
  }

  async updateMovie(id: string, updateData: Partial<InsertMovie>): Promise<Movie | undefined> {
    try {
      // Update in database first
      const updatedMovie = await MovieModel.findByIdAndUpdate(
        id,
        updateData,
        { new: true }
      ).lean();
      if (!updatedMovie) return undefined;
      const movieObj = {
        ...updatedMovie,
        id: updatedMovie._id.toString(),
        _id: undefined
      } as unknown as Movie;
      // Update cache immediately
      this.movieCache.set(id, movieObj);
      console.log(`Movie updated and cache refreshed: ${movieObj.title}`);
      return movieObj;
    } catch (error) {
      console.error("Error updating movie:", error);
      return undefined;
    }
  }

  async deleteMovie(id: string): Promise<boolean> {
    try {
      // Delete from database first
      const result = await MovieModel.findByIdAndDelete(id);
      // If deleted successfully, remove from cache
      if (result) {
        this.movieCache.delete(id);
        console.log(`Movie deleted and removed from cache: ${result.title}`);
      }
      return !!result;
    } catch (error) {
      console.error("Error deleting movie:", error);
      return false;
    }
  }
}