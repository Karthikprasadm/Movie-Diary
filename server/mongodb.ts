import mongoose from 'mongoose';
import { Movie, User } from '@shared/schema';

// Set up MongoDB connection
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/movies-app';

mongoose.connect(MONGODB_URI)
  .then(() => {
    console.log('Connected to MongoDB');
  })
  .catch(err => {
    console.error('MongoDB connection error:', err);
  });

// Define Mongoose Schemas
const userSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true }
});

const movieSchema = new mongoose.Schema({
  title: { type: String, required: true },
  genre: { type: String, required: true },
  rating: { type: Number, required: true, default: 5 },
  watched: { type: Boolean, required: true, default: false },
  review: { type: String },
  posterUrl: { type: String }
});

// Create and export models
export const UserModel = mongoose.model<User>('User', userSchema);
export const MovieModel = mongoose.model<Movie>('Movie', movieSchema);

export default mongoose;