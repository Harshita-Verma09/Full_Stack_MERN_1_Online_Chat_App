// models/messageModel.js
import mongoose from "mongoose";

const messageSchema = new mongoose.Schema({
    sender: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: "User", 
        required: true 
    },
    receiver: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: "User", 
        required: true 
    },
    content: { 
        type: String, 
        required: true 
    },
    read: { 
        type: Boolean,
        default: false 
        },
}, { timestamps: true }); // ✅ This adds createdAt & updatedAt automatically

export default mongoose.model("Message", messageSchema);

