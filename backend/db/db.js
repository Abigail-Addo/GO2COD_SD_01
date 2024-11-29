import mongoose from "mongoose";
import dotenv from "dotenv";
dotenv.config();

const mongodbUrl = process.env.MONGODB_URI;

const connectDB = async () => {
  try {
    const connection = await mongoose.connect(mongodbUrl);
    if (connection) {
      console.log("Database connected successfully");
    }
  } catch (error) {
    console.error(error);
  }
};

export default connectDB;
