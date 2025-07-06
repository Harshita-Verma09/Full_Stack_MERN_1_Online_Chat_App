import aiServices from "../services/aiServices.js";
import AIChat from "../models/aiModel.js";
import mongoose from "mongoose";

const talkToAI = async (req, res) => {
  try {
    const { userId, message } = req.body;

    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({ error: "Invalid user ID format" });
    }

    const aiResponse =
      (await aiServices.getResponseFromLlama(message)) ||
      "Sorry, I'm having trouble responding right now.";

    //  Check if chat already exists
    let chat = await AIChat.findOne({ userId });

    if (!chat) {
      // If not, create new
      chat = new AIChat({
        userId,
        messages: [
          { sender: "user", text: message },
          { sender: "ai", text: aiResponse },
        ],
      });
    } else {
      //  If exists, push new messages to the array
      chat.messages.push({ sender: "user", text: message });
      chat.messages.push({ sender: "ai", text: aiResponse });
    }

    await chat.save();
    console.log(" Saved chat to MongoDB:", chat);

    res.status(200).json({ response: aiResponse });
  } catch (err) {
    console.error(" AI Talk error:", err);
    res.status(500).json({ error: "AI communication failed" });
  }
};


const getAIHistory = async (req, res) => {
  try {
    const { userId } = req.params;
    const history = await AIChat.find({ userId });
    res.status(200).json(history);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch chat history" });
  }
};

export { talkToAI, getAIHistory };
