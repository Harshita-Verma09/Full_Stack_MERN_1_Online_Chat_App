import GroupMessage from "../models/groupMessageModel.js";
import User from "../models/userModels.js";
import Group from "../models/groupModel.js";

// const sendGroupMessage = async (req, res) => {
//   const { senderName, text } = req.body;
//   const groupName = decodeURIComponent(req.params.groupName); // ✅ Get from URL
//   console.log("Group members: ✅", groupName);
//   console.log("Sender Name:", senderName);

//   try {
//     const sender = await User.findOne({ name: senderName });
//     if (!sender) return res.status(404).json({ error: "Sender not found" });

//     const group = await Group.findOne({ name: groupName });
//     if (!group) return res.status(404).json({ error: "Group not found" });

//     if (!group.members.includes(sender._id)) {
//       return res.status(403).json({ error: "User is not a member of this group" });
//     }

//     const message = new GroupMessage({
//       groupId: group._id,
//       sender: sender._id,
//       text,
//       readBy: [sender._id],
//     });

//     await message.save();
//     res.status(201).json({
//       message: "Message sent successfully",
//       sender: sender.name,
//       text: message.text,
//     });
//   } catch (err) {
//     console.error(err);
//     res.status(500).json({ error: "Failed to send message" });
//   }
// };










const sendGroupMessage = async (req, res) => {
  const { senderName, text } = req.body;
  const groupName = decodeURIComponent(req.params.groupName);

  try {
    const sender = await User.findOne({ name: senderName });
    if (!sender) return res.status(404).json({ error: "Sender not found" });

    const group = await Group.findOne({ name: groupName });
    if (!group) return res.status(404).json({ error: "Group not found" });

    // 🔒 Check if sender is either a member or the admin
    const isMember = group.members.includes(sender._id);
    const isAdmin = group.admin?.toString() === sender._id.toString();

    if (!isMember && !isAdmin) {
      return res.status(403).json({ error: "You are not allowed to send messages in this group" });
    }

    const message = new GroupMessage({
      groupId: group._id,
      sender: sender._id,
      text,
      readBy: [sender._id],
    });

    await message.save();

    res.status(201).json({
      message: "Message sent successfully",
      sender: sender.name,
      text: message.text,
      sentAt: message.createdAt,
    });
  } catch (err) {
    console.error("❌ Error in sendGroupMessage:", err);
    res.status(500).json({ error: "Failed to send message" });
  }
};



// ✅ Replace this version of getGroupMessages
const getGroupMessages = async (req, res) => {
  const { groupName } = req.params;

  try {
    const decodedGroupName = decodeURIComponent(groupName);

    const group = await Group.findOne({ name: decodedGroupName });
    if (!group) return res.status(404).json({ error: "Group not found" });

    const messages = await GroupMessage.find({ groupId: group._id })
      .populate("sender", "name") // so we can access sender's name
      .sort({ createdAt: 1 });

    const formattedMessages = messages.map(msg => ({
      senderName: msg.sender?.name || "Unknown",
      text: msg.text,
      sentAt: msg.createdAt,
    }));

    res.status(200).json({ messages: formattedMessages }); // ✅ Important to return in { messages: [...] }
  } catch (err) {
    console.error("❌ Error in getGroupMessages:", err);
    res.status(500).json({ error: "Failed to fetch messages" });
  }
};



export { sendGroupMessage, getGroupMessages };
