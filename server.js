import dotenv from "dotenv";
dotenv.config(); // Load env variables first

import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import routes from "./src/routes/index.js"; // Ensure correct import

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors({ origin: ["http://localhost:3000", "http://localhost:3001"] })); // Allow multiple origins
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use("/api", routes); // Use `routes` instead of `router`

// MongoDB Connection
console.log("🔍 Connecting to MongoDB:", process.env.MONGODB_URI);
mongoose
  .connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("✅ Successfully connected to MongoDB"))
  .catch((error) => {
    console.error("❌ Failed to connect to MongoDB:", error);
    process.exit(1); // Exit process on DB connection failure
  });

// Global Error Handlers
process.on("uncaughtException", (err) => {
  console.error("🔥 Uncaught Exception:", err);
  process.exit(1);
});

process.on("unhandledRejection", (reason, promise) => {
  console.error("⚠️ Unhandled Rejection at:", promise, "reason:", reason);
});

// Start the Server
app.listen(PORT, () => {
  console.log(`🚀 Server is running at http://localhost:${PORT}`);
});
