import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();

// Establish MongoDB connection
mongoose.connect(process.env.MONGODB_URI);

export default mongoose.connection;
