import express from "express";
import { getUserProfile, updateUserProfile } from "../controllers/authController.js";

const authRouter = express.Router();

authRouter.get('/profile', getUserProfile);
authRouter.put('/profile', updateUserProfile);

export default authRouter;
