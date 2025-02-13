import { Schema, Types } from "mongoose";

const reactionSchema = new Schema(
  {
    reactionId: {
      type: Schema.Types.ObjectId,
      default: () => new Types.ObjectId(),
    },
    reactionBody: {
      type: String,
      required: [true, "Reaction body is required"],
      maxlength: [280, "Reaction body cannot exceed 280 characters"],
    },
    username: {
      type: String,
      required: [true, "Username is required"],
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
  },
  {
    toJSON: {
      getters: true,
    },
    id: false,
  }
);

export default reactionSchema;
