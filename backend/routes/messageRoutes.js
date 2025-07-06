// routes/messageRoutes.js
import express from "express";
import { 
    sendMessage, 
    getMessages,
    markMessagesAsRead, 
    getUnreadCount,
    getAllUsers,
    
} from "../controllers/messagesControllers.js";
import protect from "../middleware/protect.js";

const router = express.Router();

router.post("/send", protect, sendMessage);
router.get("/chat/:userId", protect, getMessages);
router.put("/read/:userId", protect, markMessagesAsRead);
router.get("/unread", protect, getUnreadCount);
router.get("/all-users", protect, getAllUsers); 



export default router;
