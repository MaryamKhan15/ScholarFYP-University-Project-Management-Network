const mongoose = require('mongoose');

const connectDB = async () => {
  const uri = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/fyp_management';
  try {
    const conn = await mongoose.connect(uri, {
      serverSelectionTimeoutMS: 5000,
    });
    console.log(`[MongoDB Connected]: ${conn.connection.host}`);
  } catch (error) {
    console.log(`\n======================================================`);
    console.log(`[MongoDB Connection Failed]: ${error.message}`);
    console.log(`[Reason]: Your current IP address is not whitelisted in MongoDB Atlas.`);
    console.log(`======================================================\n`);
    // Disable command buffering so API calls fail fast with clear error instead of timing out after 10s
    mongoose.set('bufferCommands', false);
  }
};

module.exports = connectDB;
