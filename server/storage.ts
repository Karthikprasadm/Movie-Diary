import { type Movie, type InsertMovie, type User, type InsertUser } from "@shared/schema";
import { MovieModel, UserModel } from "./mongodb";

// modify the interface with any CRUD methods
// you might need

export interface IStorage {
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  
  getAllMovies(): Promise<Movie[]>;
  getMovie(id: number): Promise<Movie | undefined>;
  createMovie(movie: InsertMovie): Promise<Movie>;
  updateMovie(id: number, movie: Partial<InsertMovie>): Promise<Movie | undefined>;
  deleteMovie(id: number): Promise<boolean>;
}

export class MongoDBStorage implements IStorage {
  async getUser(id: number): Promise<User | undefined> {
    try {
      const user = await UserModel.findById(id).lean();
      if (!user) return undefined;
      return { ...user, id: Number(user._id.toString()) } as unknown as User;
    } catch (error) {
      console.error("Error getting user:", error);
      return undefined;
    }
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    try {
      const user = await UserModel.findOne({ username }).lean();
      if (!user) return undefined;
      return { ...user, id: Number(user._id.toString()) } as unknown as User;
    } catch (error) {
      console.error("Error getting user by username:", error);
      return undefined;
    }
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    try {
      const newUser = await UserModel.create(insertUser);
      return { ...newUser.toObject(), id: Number(newUser._id.toString()) } as unknown as User;
    } catch (error) {
      console.error("Error creating user:", error);
      throw error;
    }
  }
  
  async getAllMovies(): Promise<Movie[]> {
    try {
      const movies = await MovieModel.find().lean();
      return movies.map(movie => {
        return { 
          ...movie, 
          id: Number(movie._id.toString())
        } as unknown as Movie;
      });
    } catch (error) {
      console.error("Error getting all movies:", error);
      return [];
    }
  }
  
  async getMovie(id: number): Promise<Movie | undefined> {
    try {
      const movie = await MovieModel.findById(id).lean();
      if (!movie) return undefined;
      return { ...movie, id: Number(movie._id.toString()) } as unknown as Movie;
    } catch (error) {
      console.error("Error getting movie:", error);
      return undefined;
    }
  }
  
  async createMovie(insertMovie: InsertMovie): Promise<Movie> {
    try {
      const newMovie = await MovieModel.create(insertMovie);
      return { 
        ...newMovie.toObject(), 
        id: Number(newMovie._id.toString()) 
      } as unknown as Movie;
    } catch (error) {
      console.error("Error creating movie:", error);
      throw error;
    }
  }
  
  async updateMovie(id: number, updateData: Partial<InsertMovie>): Promise<Movie | undefined> {
    try {
      const updatedMovie = await MovieModel.findByIdAndUpdate(
        id, 
        updateData, 
        { new: true }
      ).lean();
      
      if (!updatedMovie) return undefined;
      
      return { 
        ...updatedMovie, 
        id: Number(updatedMovie._id.toString()) 
      } as unknown as Movie;
    } catch (error) {
      console.error("Error updating movie:", error);
      return undefined;
    }
  }
  
  async deleteMovie(id: number): Promise<boolean> {
    try {
      const result = await MovieModel.findByIdAndDelete(id);
      return !!result;
    } catch (error) {
      console.error("Error deleting movie:", error);
      return false;
    }
  }
}

// Initialize with sample data
async function initializeWithSampleData(storage: MongoDBStorage) {
  try {
    const movies = await storage.getAllMovies();
    
    // Only add sample data if the database is empty
    if (movies.length === 0) {
      console.log("Adding sample movies to the database...");
      
      await storage.createMovie({
        title: "The Shawshank Redemption",
        genre: "Drama",
        rating: 9.3,
        watched: true,
        review: "A masterpiece about hope and redemption. The story of Andy Dufresne's unjust imprisonment and his friendship with Red makes for one of cinema's greatest stories.",
        posterUrl: "https://images.unsplash.com/photo-1536440136628-849c177e76a1?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=1200"
      });
      
      await storage.createMovie({
        title: "Inception",
        genre: "Sci-Fi",
        rating: 8.8,
        watched: true,
        review: "Christopher Nolan's mind-bending thriller about dreams within dreams. The visual effects and concept are groundbreaking.",
        posterUrl: "https://images.unsplash.com/photo-1478720568477-152d9b164e26?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=1200"
      });
      
      await storage.createMovie({
        title: "Pulp Fiction",
        genre: "Crime",
        rating: 8.9,
        watched: true,
        review: "Tarantino's masterpiece with interwoven storylines, memorable dialogue, and unforgettable characters. A true classic of 90s cinema.",
        posterUrl: "https://images.unsplash.com/photo-1515634928627-2a4e0dae3ddf?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=1200"
      });
      
      await storage.createMovie({
        title: "The Dark Knight",
        genre: "Action",
        rating: 9.0,
        watched: false,
        review: "Heath Ledger's unforgettable performance as the Joker elevates this Batman film to legendary status. A perfect blend of action and psychological tension.",
        posterUrl: "https://images.unsplash.com/photo-1531259683007-016a7b628fc3?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=1200"
      });
      
      console.log("Sample movies added successfully!");
    }
  } catch (error) {
    console.error("Error initializing sample data:", error);
  }
}

const storage = new MongoDBStorage();

// Initialize the database with sample data
// We'll call this function when the server starts to ensure we have data
initializeWithSampleData(storage).catch(console.error);

export { storage };
