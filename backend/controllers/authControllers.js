import User from "../models/userModels.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import AppError from "../utils/AppError.js";
import sendResponse from "../utils/sendResponse.js";
import sendEmail from "../utils/sendEmail.js";

const JWT_SECRET = process.env.JWT_SECRET || "secret";


// Register User
const registerUser = async (req, res, next) => {
    const { name, email, password } = req.body;

    try {
        const exist = await User.findOne({ email });
        if (exist) return next(new AppError("User already exists", 400));

        const hashPassword = await bcrypt.hash(password, 10);

        const otp = Math.floor(100000 + Math.random() * 900000).toString();
        const otpExpires = Date.now() + 5 * 60 * 1000;             // (5 mins)

        const user = await User.create({
            name,
            email,
            password: hashPassword,
            otp,
            otpExpires,
        });

        await sendEmail(email, 'Verify OTP', `Your OTP is: ${otp}`);

        sendResponse(res, 201, true, "OTP sent to your email", {
            email: user.email,
        });

    } catch (err) {
        console.log(err);
        sendResponse(res, 400, false, "Error registering user");
    }
};

//OTP Verification
const verifyOTP = async (req, res, next) => {
    const { email, otp } = req.body;

    try {
        const user = await User.findOne({ email });

        if (!user) return next(new AppError("User not found", 404));
        if (user.otp !== otp || Date.now() > user.otpExpires) {
            return next(new AppError("Invalid or expired OTP", 400));
        }

        user.isVerified = true;
        user.otp = undefined;
        user.otpExpires = undefined;
        await user.save();

        sendResponse(res, 200, true, "Email verified successfully");
    } catch (err) {
        console.log(err);
        sendResponse(res, 400, false, "OTP verification failed");
    }
};

// Login User
const loginUser = async (req, res, next) => {
    const { email, password } = req.body;

    try {
        const user = await User.findOne({ email });
        if (!user) return next(new AppError("Invalid credentials", 404));

        if (!user.isVerified) {
            return next(new AppError("Please verify your email before login", 401));
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) return next(new AppError("Invalid credentials", 401));

        const token = jwt.sign({ id: user._id }, JWT_SECRET, { expiresIn: "30d" });
          console.log("JWT Token:", token);

        sendResponse(res, 200, true, "Login successful", {
            token,
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
            },
        });

    } catch (err) {
        console.log(err);
        sendResponse(res, 400, false, "Login failed");
    }
};

// Forgot Password
const forgotPassword = async (req, res, next) => {
    const { email } = req.body;

    try {
        const user = await User.findOne({ email });
        if (!user) return next(new AppError("User not found", 404));

        // Create a reset token with 15 min expiry
        const resetToken = jwt.sign({ id: user._id }, JWT_SECRET, { expiresIn: "15m" });

        // Save token and expiry in user doc
        user.resetToken = resetToken;
        user.resetTokenExpires = Date.now() + 15 * 60 * 1000; // 15 minutes in ms
        await user.save();

        // Create reset URL — update this URL to your frontend's reset page
        const resetURL = `http://localhost:3000/reset-password/${resetToken}`;

        // Send email
        await sendEmail(email, "Reset Your Password", `Click here to reset your password: ${resetURL}`);

        sendResponse(res, 200, true, "Reset password link sent to your email");
    } catch (err) {
        console.error("Forgot password error:", err);
        sendResponse(res, 500, false, "Failed to send reset link");
    }
};

// Reset Password
const resetPassword = async (req, res, next) => {
    const { token } = req.params;
    const { newPassword, confirmPassword } = req.body;

    if (newPassword !== confirmPassword) {
        return next(new AppError("Passwords do not match", 400));
    }

    try {
        // Verify token validity
        const decoded = jwt.verify(token, JWT_SECRET);

        // Find user by ID, reset token, and check token not expired
        const user = await User.findOne({
            _id: decoded.id,
            resetToken: token,
            resetTokenExpires: { $gt: Date.now() },
        });

        if (!user) {
            return next(new AppError("Invalid or expired token", 400));
        }

        // Hash new password
        const hashedPassword = await bcrypt.hash(newPassword, 10);

        // Update password and clear reset token fields
        user.password = hashedPassword;
        user.resetToken = undefined;
        user.resetTokenExpires = undefined;

        await user.save();

        sendResponse(res, 200, true, "Password reset successful");
    } catch (err) {
        console.error("Reset password error:", err);
        sendResponse(res, 400, false, "Token verification failed or invalid");
    }
};


//Logout (Optional)
const logoutUser = (req, res) => {
    sendResponse(res, 200, true, "Logged out successfully");
};


export {
    registerUser,
    loginUser,
    logoutUser,
    verifyOTP,
    forgotPassword,
    resetPassword,
};

