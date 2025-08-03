// Script to fix the githubId duplicate key error
// Run this script to drop and recreate the githubId index

import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

async function fixGithubIdIndex() {
  try {
    console.log('🔄 Connecting to MongoDB...');
    await mongoose.connect(process.env.MONGO_URI);
    console.log('✅ Connected to MongoDB');

    const db = mongoose.connection.db;
    const usersCollection = db.collection('users');

    console.log('🔄 Checking existing indexes...');
    const indexes = await usersCollection.indexes();
    console.log('Current indexes:', indexes.map(idx => idx.name));

    // Drop the problematic githubId index if it exists
    try {
      await usersCollection.dropIndex('githubId_1');
      console.log('✅ Dropped existing githubId_1 index');
    } catch (error) {
      console.log('ℹ️  githubId_1 index does not exist or already dropped');
    }

    // Create the correct sparse index
    await usersCollection.createIndex(
      { githubId: 1 }, 
      { 
        unique: true, 
        sparse: true,
        name: 'githubId_1'
      }
    );
    console.log('✅ Created new sparse githubId index');

    console.log('🎉 Index fix completed successfully!');
    
  } catch (error) {
    console.error('❌ Error fixing index:', error);
  } finally {
    await mongoose.disconnect();
    console.log('👋 Disconnected from MongoDB');
    process.exit(0);
  }
}

fixGithubIdIndex();
