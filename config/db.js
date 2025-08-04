

import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();

const connectDB = async () => {
  try {
    // Check if MONGO_URI is provided
    if (!process.env.MONGO_URI) {
      throw new Error('MONGO_URI environment variable is not set');
    }

    console.log('🔌 Connecting to MongoDB...');
    console.log('🌐 MongoDB URI:', process.env.MONGO_URI.replace(/\/\/[^:]+:[^@]+@/, '//***:***@')); // Hide credentials
    
    await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    
    console.log('✅ MongoDB connected successfully');
  } catch (error) {
    console.error('❌ MongoDB connection error:', error.message);
    console.error('💡 Make sure your MONGO_URI environment variable is set correctly');
    process.exit(1);
  }
};

// Connection event listeners
mongoose.connection.on('connected', () => {
  console.log('📡 MongoDB connection established');
});

mongoose.connection.on('disconnected', () => {
  console.log('📴 MongoDB disconnected');
});

mongoose.connection.on('error', (err) => {
  console.error('❌ MongoDB connection error:', err);
});

export default mongoose.connection;
export { connectDB };