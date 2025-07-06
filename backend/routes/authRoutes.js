import express from "express";
import {
    registerUser,
    loginUser,
    logoutUser,
    verifyOTP,
    forgotPassword,
    resetPassword
} from "../controllers/authControllers.js"

const router = express.Router();
router.post("/register", registerUser);
router.post("/verify-otp", verifyOTP);
router.post("/login", loginUser);
router.post("/logout", logoutUser);

router.post("/forgot-password", forgotPassword);
router.post("/reset-password/:token", resetPassword);
export default router;

