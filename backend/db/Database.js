const mongoose = require("mongoose");

let isConnected = false;

const connectDatabase = async () => {
  if (isConnected) {
    return;
  }

  try {
    console.log("Attempting MongoDB connection...");
    console.log("DB_URL exists:", !!process.env.DB_URL);

    const data = await mongoose.connect(process.env.DB_URL, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      serverSelectionTimeoutMS: 30000,
      connectTimeoutMS: 30000,
      socketTimeoutMS: 45000,
    });
    isConnected = true;
    console.log(`MongoDB connected with server: ${data.connection.host}`);
  } catch (err) {
    console.log(`MongoDB connection error: ${err.message}`);
    console.log(`Full error:`, err);
    throw err;
  }
};

module.exports = connectDatabase;
