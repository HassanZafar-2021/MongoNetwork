import { Router } from "express";
const router = Router();
import {
  getAllThoughts,
  getThought, // Fixed name
  addThought, // Used correctly
  editThought,
  removeThought,
  createReaction,
  deleteReaction,
} from "../../controllers/thoughtController.js";

// Routes for thoughts
router.route("/").get(getAllThoughts).post(addThought); // Fixed naming issue

router
  .route("/:thoughtId")
  .get(getThought) // Fixed from addThought
  .put(editThought)
  .delete(removeThought);

// Routes for managing reactions
router.route("/:thoughtId/reactions").post(createReaction);
router.route("/:thoughtId/reactions/:reactionId").delete(deleteReaction);

export default router;
