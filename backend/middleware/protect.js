// middlewares/protect.js
import jwt from "jsonwebtoken";
import User from "../models/userModels.js";
import AppError from "../utils/AppError.js";
const JWT_SECRET = process.env.JWT_SECRET || "secret";

const protect = async (req, res, next) => {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
        return next(new AppError("No token, authorization denied", 401));
    }

    const token = authHeader.split(" ")[1];

    try {
        const decoded = jwt.verify(token, JWT_SECRET);

        const user = await User.findById(decoded.id).select("-password"); // ✅ User model se find
        if (!user) return next(new AppError("User not found", 404));

        req.user = user; // ✅ Yahaan req.user assign ho gaya
        next();
    } catch (err) {
        next(new AppError("Invalid token", 401));
    }
};

export default protect;
