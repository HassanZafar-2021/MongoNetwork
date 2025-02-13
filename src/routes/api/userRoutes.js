import { Router } from "express";
const router = Router();
import {
  fetchUsers,
  fetchUserById,
  registerUser,
  modifyUser,
  removeUser,
  linkFriend,
  unlinkFriend,
} from "../../controllers/userController.js";

// User routes
router.route("/").get(fetchUsers).post(registerUser);

router
  .route("/:userId")
  .get(fetchUserById)
  .put(modifyUser) // Use PATCH instead of PUT for partial updates
  .delete(removeUser);

// Friend routes
router
  .route("/:userId/friends/:friendId")
  .post(linkFriend)
  .delete(unlinkFriend);

export default router;
