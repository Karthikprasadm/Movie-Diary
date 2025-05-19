import { movies, type Movie, type InsertMovie, users, type User, type InsertUser } from "@shared/schema";

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

export class MemStorage implements IStorage {
  private users: Map<number, User>;
  private moviesMap: Map<number, Movie>;
  private userCurrentId: number;
  private movieCurrentId: number;

  constructor() {
    this.users = new Map();
    this.moviesMap = new Map();
    this.userCurrentId = 1;
    this.movieCurrentId = 1;
    
    // Add some sample movies for testing
    this.createMovie({
      title: "The Shawshank Redemption",
      genre: "Drama",
      rating: 9.3,
      watched: true,
      review: "A masterpiece about hope and redemption. The story of Andy Dufresne's unjust imprisonment and his friendship with Red makes for one of cinema's greatest stories.",
      posterUrl: "https://images.unsplash.com/photo-1536440136628-849c177e76a1?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=1200"
    });
    
    this.createMovie({
      title: "Inception",
      genre: "Sci-Fi",
      rating: 8.8,
      watched: true,
      review: "Christopher Nolan's mind-bending thriller about dreams within dreams. The visual effects and concept are groundbreaking.",
      posterUrl: "https://images.unsplash.com/photo-1478720568477-152d9b164e26?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=1200"
    });
    
    this.createMovie({
      title: "Pulp Fiction",
      genre: "Crime",
      rating: 8.9,
      watched: true,
      review: "Tarantino's masterpiece with interwoven storylines, memorable dialogue, and unforgettable characters. A true classic of 90s cinema.",
      posterUrl: "https://images.unsplash.com/photo-1515634928627-2a4e0dae3ddf?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=1200"
    });
    
    this.createMovie({
      title: "The Dark Knight",
      genre: "Action",
      rating: 9.0,
      watched: false,
      review: "Heath Ledger's unforgettable performance as the Joker elevates this Batman film to legendary status. A perfect blend of action and psychological tension.",
      posterUrl: "https://images.unsplash.com/photo-1531259683007-016a7b628fc3?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=1200"
    });
  }

  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username,
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = this.userCurrentId++;
    const user: User = { ...insertUser, id };
    this.users.set(id, user);
    return user;
  }
  
  async getAllMovies(): Promise<Movie[]> {
    return Array.from(this.moviesMap.values());
  }
  
  async getMovie(id: number): Promise<Movie | undefined> {
    return this.moviesMap.get(id);
  }
  
  async createMovie(insertMovie: InsertMovie): Promise<Movie> {
    const id = this.movieCurrentId++;
    const movie: Movie = { ...insertMovie, id };
    this.moviesMap.set(id, movie);
    return movie;
  }
  
  async updateMovie(id: number, updateData: Partial<InsertMovie>): Promise<Movie | undefined> {
    const existingMovie = this.moviesMap.get(id);
    
    if (!existingMovie) {
      return undefined;
    }
    
    const updatedMovie: Movie = { ...existingMovie, ...updateData };
    this.moviesMap.set(id, updatedMovie);
    
    return updatedMovie;
  }
  
  async deleteMovie(id: number): Promise<boolean> {
    return this.moviesMap.delete(id);
  }
}

export const storage = new MemStorage();
