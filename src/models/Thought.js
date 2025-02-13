import { Schema, model } from "mongoose";
import reactionSchema from "./Reaction.js";

const thoughtSchema = new Schema(
  {
    thoughtText: {
      type: String,
      required: [true, "Thought content is required"],
      minlength: [1, "Thought must contain at least 1 character"],
      maxlength: [280, "Thought cannot exceed 280 characters"],
    },
    createdAt: {
      type: Date,
      default: Date.now,
      get: (timestamp) =>
        new Intl.DateTimeFormat("en-US", {
          dateStyle: "medium",
          timeStyle: "short",
        }).format(timestamp),
    },
    username: {
      type: String,
      required: [true, "Associated username is required"],
    },
    reactions: [reactionSchema], // Embedded reactions
  },
  {
    toJSON: {
      virtuals: true,
      getters: true,
    },
    id: false, // Prevents Mongoose from adding a virtual "id" field
  }
);

// Virtual to compute reaction count
thoughtSchema.virtual("reactionCount").get(function () {
  return this.reactions.length;
});

// Export Thought model
export default model("Thought", thoughtSchema);
