import User from "../models/User.js";
import Thought from "../models/Thought.js";
import mongoose from "mongoose"; 

// Fetch all users
export const fetchUsers = async (req, res) => {
  try {
    const users = await User.find({});
    return res.json(users);
  } catch (error) {
    return res.status(500).json({ error: "Failed to retrieve users" });
  }
};

// Fetch a single user by ID with populated data
export const fetchUserById = async (req, res) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.userId)) {
      return res.status(400).json({ error: "Invalid User ID" });
    }

    const user = await User.findById(req.params.userId)
      .populate("thoughts")
      .populate("friends");

    if (!user) return res.status(404).json({ error: "User not found" });

    return res.json(user);
  } catch (error) {
    return res.status(500).json({ error: "Error retrieving user" });
  }
};

// Create a new user
export const registerUser = async (req, res) => {
  try {
    const newUser = await User.create(req.body);
    return res.status(201).json(newUser);
  } catch (error) {
    return res
      .status(400)
      .json({ error: error.message || "User creation failed" });
  }
};

// Modify an existing user
export const modifyUser = async (req, res) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.userId)) {
      return res.status(400).json({ error: "Invalid User ID" });
    }

    const updatedUser = await User.findByIdAndUpdate(
      req.params.userId,
      req.body,
      { new: true, runValidators: true }
    );

    if (!updatedUser) return res.status(404).json({ error: "User not found" });

    return res.json(updatedUser);
  } catch (error) {
    return res.status(400).json({ error: "User update failed" });
  }
};

// Delete a user and their associated thoughts
export const removeUser = async (req, res) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.userId)) {
      return res.status(400).json({ error: "Invalid User ID" });
    }

    const user = await User.findByIdAndDelete(req.params.userId);
    if (!user) return res.status(404).json({ error: "User not found" });

    // Delete all thoughts associated with the user
    await Thought.deleteMany({ _id: { $in: user.thoughts } });

    return res.json({ message: "User and associated thoughts deleted" });
  } catch (error) {
    return res.status(500).json({ error: "Error deleting user" });
  }
};

// Add a friend to the user's friend list
export const linkFriend = async (req, res) => {
  try {
    const { userId, friendId } = req.params;

    if (
      !mongoose.Types.ObjectId.isValid(userId) ||
      !mongoose.Types.ObjectId.isValid(friendId)
    ) {
      return res.status(400).json({ error: "Invalid User or Friend ID" });
    }

    if (userId === friendId) {
      return res
        .status(400)
        .json({ error: "You cannot add yourself as a friend" });
    }

    const user = await User.findByIdAndUpdate(
      userId,
      { $addToSet: { friends: friendId } }, // Prevents duplicates
      { new: true }
    ).populate("friends");

    if (!user) return res.status(404).json({ error: "User not found" });

    return res.json(user);
  } catch (error) {
    return res.status(500).json({ error: "Failed to add friend" });
  }
};

// Remove a friend from the user's friend list
export const unlinkFriend = async (req, res) => {
  try {
    const { userId, friendId } = req.params;

    if (
      !mongoose.Types.ObjectId.isValid(userId) ||
      !mongoose.Types.ObjectId.isValid(friendId)
    ) {
      return res.status(400).json({ error: "Invalid User or Friend ID" });
    }

    const user = await User.findByIdAndUpdate(
      userId,
      { $pull: { friends: friendId } }, // Removes the friend
      { new: true }
    ).populate("friends");

    if (!user) return res.status(404).json({ error: "User not found" });

    return res.json(user);
  } catch (error) {
    return res.status(500).json({ error: "Failed to remove friend" });
  }
};
