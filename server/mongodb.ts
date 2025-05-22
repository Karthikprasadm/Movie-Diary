import mongoose from 'mongoose';
import { Movie, User } from '@shared/schema';

// Set up MongoDB connection
// This will connect to your local MongoDB when running on your PC
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/moviesDB';

console.log('Attempting to connect to MongoDB at:', MONGODB_URI);

// Configure Mongoose for better persistence and real-time synchronization
mongoose.set('strictQuery', false);
mongoose.set('bufferCommands', false); // Disable command buffering for immediate execution

// Connection options for better reliability and real-time operations
const connectionOptions = {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  autoIndex: true,
  serverSelectionTimeoutMS: 5000, // Timeout after 5s instead of 30s
  socketTimeoutMS: 45000, // Close sockets after 45s of inactivity
  family: 4 // Use IPv4, skip trying IPv6
};

// Connect with retry logic for better reliability
const connectWithRetry = () => {
  console.log('MongoDB connection attempt...');
  mongoose.connect(MONGODB_URI)
    .then(() => {
      console.log('Successfully connected to MongoDB at:', MONGODB_URI);
    })
    .catch(err => {
      console.error('MongoDB connection error:', err);
      console.log('Make sure MongoDB is running on your local machine');
      console.log('Retrying connection in 5 seconds...');
      setTimeout(connectWithRetry, 5000);
    });
};

connectWithRetry();

// Handle connection events for better monitoring and recovery
mongoose.connection.on('connected', () => {
  console.log('MongoDB connection established');
});

mongoose.connection.on('error', (err) => {
  console.error('MongoDB connection error:', err);
  mongoose.disconnect();
});

mongoose.connection.on('disconnected', () => {
  console.log('MongoDB connection disconnected, attempting to reconnect...');
  setTimeout(connectWithRetry, 5000);
});

// Handle application termination
process.on('SIGINT', () => {
  mongoose.connection.close().then(() => {
    console.log('MongoDB connection closed due to application termination');
    process.exit(0);
  });
});

// Define Mongoose Schemas
const userSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true }
}, { timestamps: true }); // Add timestamps for tracking document changes

const movieSchema = new mongoose.Schema({
  title: { type: String, required: true },
  genre: { type: String, required: true },
  rating: { type: Number, required: true, default: 5 },
  watched: { type: Boolean, required: true, default: false },
  review: { type: String },
  posterUrl: { type: String }
}, { 
  timestamps: true, // Add timestamps for tracking document changes
});

// Add middleware to ensure proper synchronization
movieSchema.post('save', function(doc) {
  console.log(`Movie saved to MongoDB: ${doc.title}`);
});

movieSchema.post('findOneAndUpdate', function(doc) {
  if (doc) {
    console.log(`Movie updated in MongoDB: ${doc.title}`);
  }
});

movieSchema.post('findOneAndDelete', function(doc) {
  if (doc) {
    console.log(`Movie deleted from MongoDB: ${doc.title}`);
  }
});

// Create and export models
export const UserModel = mongoose.model<User & mongoose.Document>('User', userSchema);
export const MovieModel = mongoose.model<Movie & mongoose.Document>('Movie', movieSchema);

export default mongoose;