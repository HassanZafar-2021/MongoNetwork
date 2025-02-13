import User from "../models/User.js";
import Thought from "../models/Thought.js";
import mongoose from "mongoose"; // For ObjectId validation

// Retrieve all thoughts
export const getAllThoughts = async (req, res) => {
  try {
    const thoughts = await Thought.find({});
    res.json(thoughts);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to fetch thoughts" });
  }
};

// Retrieve a single thought by its ID
export const getThought = async (req, res) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.thoughtId)) {
      return res.status(400).json({ error: "Invalid Thought ID" });
    }

    const thought = await Thought.findById(req.params.thoughtId);
    if (!thought) return res.status(404).json({ error: "Thought not found" });

    res.json(thought);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error retrieving thought" });
  }
};

// Create a new thought and link it to a user
export const addThought = async (req, res) => {
  try {
    const { userId, thoughtText } = req.body;

    if (!userId || !thoughtText) {
      return res
        .status(400)
        .json({ error: "User ID and thought text are required" });
    }

    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({ error: "Invalid User ID" });
    }

    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ error: "User not found" });

    const newThought = await Thought.create({
      thoughtText,
      username: user.username,
    });

    await User.findByIdAndUpdate(
      userId,
      { $push: { thoughts: newThought._id } },
      { new: true }
    );

    res.status(201).json(newThought);
  } catch (error) {
    console.error(error);
    res.status(400).json({ error: "Failed to create thought" });
  }
};

// Modify an existing thought
export const editThought = async (req, res) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.thoughtId)) {
      return res.status(400).json({ error: "Invalid Thought ID" });
    }

    const updatedThought = await Thought.findByIdAndUpdate(
      req.params.thoughtId,
      req.body,
      { new: true, runValidators: true }
    );

    if (!updatedThought)
      return res.status(404).json({ error: "Thought not found" });

    res.json(updatedThought);
  } catch (error) {
    console.error(error);
    res.status(400).json({ error: "Failed to update thought" });
  }
};

// Delete a thought and remove it from the user's thoughts list
export const removeThought = async (req, res) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.thoughtId)) {
      return res.status(400).json({ error: "Invalid Thought ID" });
    }

    const deletedThought = await Thought.findByIdAndDelete(
      req.params.thoughtId
    );
    if (!deletedThought)
      return res.status(404).json({ error: "Thought not found" });

    await User.findOneAndUpdate(
      { thoughts: req.params.thoughtId },
      { $pull: { thoughts: req.params.thoughtId } },
      { new: true }
    );

    res.json({ message: "Thought successfully deleted" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error deleting thought" });
  }
};

// Add a reaction to a thought
export const createReaction = async (req, res) => {
  try {
    const { reactionBody, username } = req.body;

    if (!reactionBody || !username) {
      return res
        .status(400)
        .json({ error: "Reaction body and username are required" });
    }

    if (!mongoose.Types.ObjectId.isValid(req.params.thoughtId)) {
      return res.status(400).json({ error: "Invalid Thought ID" });
    }

    const thought = await Thought.findByIdAndUpdate(
      req.params.thoughtId,
      { $push: { reactions: req.body } },
      { new: true, runValidators: true }
    );

    if (!thought) return res.status(404).json({ error: "Thought not found" });

    res.json(thought);
  } catch (error) {
    console.error(error);
    res.status(400).json({ error: "Failed to add reaction" });
  }
};

// Remove a reaction from a thought
export const deleteReaction = async (req, res) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.thoughtId)) {
      return res.status(400).json({ error: "Invalid Thought ID" });
    }

    const thought = await Thought.findByIdAndUpdate(
      req.params.thoughtId,
      { $pull: { reactions: { reactionId: req.params.reactionId } } },
      { new: true }
    );

    if (!thought) return res.status(404).json({ error: "Thought not found" });

    res.json(thought);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error removing reaction" });
  }
};
