import express from "express";
import userRoutes from "./api/userRoutes.js";
import thoughtRoutes from "./api/thoughtRoutes.js";

const router = express.Router(); // Instantiate Router

// Corrected routes (no extra `/api`)
router.use("/users", userRoutes);
router.use("/thoughts", thoughtRoutes);

export default router;
