import mongoose from "mongoose";

import dotenv from "dotenv";
dotenv.config();

const mongoURI = process.env.MONGO_URI;

const connectDB = async () => {
  try {
    if (!mongoURI) {
      throw new Error("MongoDB URI is not defined");
    }

    await mongoose.connect(mongoURI);
    console.log("MongoDB connected");
  } catch (error) {
    console.error("Error connecting to MongoDB:", error.message);
    process.exit(1);
  }
};

export default connectDB;
