import mongoose from 'mongoose';
import { Movie, User } from '@shared/schema';

// Set up MongoDB connection
// This will connect to your local MongoDB when running on your PC
const MONGODB_URI = 'mongodb://localhost:27017/favorite-movies';

console.log('Attempting to connect to MongoDB at:', MONGODB_URI);

mongoose.connect(MONGODB_URI)
  .then(() => {
    console.log('Successfully connected to MongoDB at:', MONGODB_URI);
  })
  .catch(err => {
    console.error('MongoDB connection error:', err);
    console.log('Make sure MongoDB is running on your local machine');
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
export const UserModel = mongoose.model<User & mongoose.Document>('User', userSchema);
export const MovieModel = mongoose.model<Movie & mongoose.Document>('Movie', movieSchema);

export default mongoose;