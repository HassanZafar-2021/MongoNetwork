import mongoose from "mongoose";
import dotenv from "dotenv";
import User from "../src/models/User.js"; // Default import
import Thought from "../src/models/Thought.js"; // Default import

dotenv.config();

const MONGODB_URI =
  process.env.MONGODB_URI || "mongodb://127.0.0.1:27017/mongonetwork";

// Connect to MongoDB
const connectDB = async () => {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log("✅ Connected to MongoDB for seeding...");
  } catch (error) {
    console.error("❌ MongoDB Connection Failed:", error);
    process.exit(1);
  }
};

const seedDatabase = async () => {
  try {
    await connectDB();

    // Clear existing data
    await User.deleteMany({});
    await Thought.deleteMany({});
    console.log("🗑️ Existing data cleared.");

    // Seed Users
    const users = await User.insertMany([
      { username: "alice", email: "alice@example.com", thoughts: [] },
      { username: "bob", email: "bob@example.com", thoughts: [] },
      { username: "charlie", email: "charlie@example.com", thoughts: [] },
    ]);
    console.log("👥 Users seeded.");

    // Seed Thoughts
    const thoughtsData = [
      { thoughtText: "MongoDB is awesome!", username: "alice" },
      { thoughtText: "I love NoSQL databases!", username: "bob" },
      { thoughtText: "Social networks are cool!", username: "charlie" },
    ];

    const thoughts = await Promise.all(
      thoughtsData.map(async (thought) => {
        const createdThought = await Thought.create(thought);
        const user = await User.findOne({ username: thought.username });
        if (user) {
          user.thoughts.push(createdThought._id);
          await user.save();
        }
        return createdThought;
      })
    );
    console.log("💭 Thoughts seeded & linked to users.");

    console.log("✅ Database seeding complete!");
  } catch (error) {
    console.error("❌ Seeding failed:", error);
  } finally {
    await mongoose.disconnect();
    console.log("🔌 Disconnected from MongoDB.");
  }
};

// Run the seed function
seedDatabase();
