// Connect to MongoDB
const mongoose = require("mongoose");
const dotenv = require("dotenv");
dotenv.config();
const connectDb = async () => {
  try {
    await mongoose
      .connect(process.env.MONGO_URI)
      .then(() => console.log("Connected to MongoDB"))
      .catch((err) => console.error("MongoDB connection error:", err));
  } catch (error) {
    console.error("Error connecting to MongoDB:", error);
  }
};

module.exports = connectDb;
