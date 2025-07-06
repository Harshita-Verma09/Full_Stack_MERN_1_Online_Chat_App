import User from "../models/userModels.js"
import Message from "../models/messageModel.js";
import sendResponse from "../utils/sendResponse.js";
import AppError from "../utils/AppError.js";
import mongoose from "mongoose"; // 👈 This line is missing


//Basic Send Message
export const sendMessage = async (req, res, next) => {
    const { receiverId, content } = req.body;
    const senderId = req.user.id;

    try {
        const message = await Message.create({
            sender: senderId,
            receiver: receiverId,
            content,
            read: false,
        });

        // ✅ Populate sender and receiver fields
        const fullMessage = await message.populate("sender receiver");

        sendResponse(res, 201, true, "Message sent", fullMessage);
       
    } catch (err) {
        next(new AppError("Failed to send message", 500));
    }
};


//Get All Messages Between 2 Users with Names & Read Status
export const getMessages = async (req, res, next) => {
    const myId = req.user.id;
    const userId = req.params.userId;

    try {
        const messages = await Message.aggregate([
            {
                $match: {
                    $or: [
                        { sender: new mongoose.Types.ObjectId(myId), receiver: new mongoose.Types.ObjectId(userId) },
                        { sender: new mongoose.Types.ObjectId(userId), receiver: new mongoose.Types.ObjectId(myId) }
                    ]
                }
            },
            {
                $lookup: {
                    from: "users",
                    localField: "sender",
                    foreignField: "_id",
                    as: "senderData"
                }
            },
            { $unwind: "$senderData" },
            {
                $lookup: {
                    from: "users",
                    localField: "receiver",
                    foreignField: "_id",
                    as: "receiverData"
                }
            },
            { $unwind: "$receiverData" },
            {
                $project: {
                    content: 1,
                    senderId: "$sender",             
                    createdAt: 1,
                    read: 1,
                    senderName: "$senderData.name",
                    receiverName: "$receiverData.name"
                }
            },
            { $sort: { time: 1 } }
        ]);

        sendResponse(res, 200, true, "Messages fetched", messages);
    } catch (err) {
        next(new AppError("Failed to fetch messages", 500));
    }
};


//Mark Messages as Read (when receiver opens chat)
export const markMessagesAsRead = async (req, res, next) => {
    const myId = req.user.id;
    const userId = req.params.userId;

    try {
        await Message.updateMany(
            {
                sender: userId,
                receiver: myId,
                read: false,
            },
            { $set: { read: true } }
        );

        sendResponse(res, 200, true, "Messages marked as read");
    } catch (err) {
        next(new AppError("Failed to update read status", 500));
    }
};


// Unread Message Count (badge show karne ke liye)
export const getUnreadCount = async (req, res, next) => {
    const myId = req.user.id;

    try {
        const counts = await Message.aggregate([
            { $match: { receiver: new mongoose.Types.ObjectId(myId), read: false } },
            {
                $group: {
                    _id: "$sender",
                    count: { $sum: 1 }
                }
            },
            {
                $lookup: {
                    from: "users",
                    localField: "_id",
                    foreignField: "_id",
                    as: "senderData"
                }
            },
            { $unwind: "$senderData" },
            {
                $project: {
                    senderId: "$_id",
                    senderName: "$senderData.name",
                    count: 1
                }
            }
        ]);

        sendResponse(res, 200, true, "Unread count fetched", counts);
    } catch (err) {
        next(new AppError("Failed to get unread count", 500));
    }
};


const getAllUsers = async (req, res) => {
    try {
        const users = await User.find().select("-password"); // Exclude password
        sendResponse(res, 200, true, "All users fetched", users);
    } catch (error) {
        sendResponse(res, 500, false, "Failed to fetch users");
    }
};

export { getAllUsers };
