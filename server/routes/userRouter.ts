import express from "express";
import {
    acceptFriendRequest,
    getAllUsers,
    getUserById,
    loginUser,
    registerUser,
    sendFriendRequest,
} from "../controllers/userController";
import { protect } from "../utils/auth";
const userRouter = express.Router();

userRouter.post("/login", loginUser);
userRouter.post("/register", registerUser);

userRouter.get("/", protect, getAllUsers);
userRouter.get("/:id", protect, getUserById);
userRouter.post("/sendRequest", protect, sendFriendRequest);
userRouter.post("/addFriend", protect, acceptFriendRequest);

export default userRouter;
