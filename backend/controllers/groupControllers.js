import Group from "../models/groupModel.js";
import User from "../models/userModels.js";

// Create group using names instead of IDs
const createGroup = async (req, res) => {
  const { name, adminEmail, memberEmails } = req.body;

  if (!name || !adminEmail || !Array.isArray(memberEmails)) {
    return res.status(400).json({ error: "Missing group name, adminEmail or memberEmails" });
  }

  if (memberEmails.length < 1 || memberEmails.length > 20) {
    return res.status(400).json({ error: "Group must have between 1 and 20 members" });
  }

  try {
    const admin = await User.findOne({ email: adminEmail });
    if (!admin) return res.status(404).json({ error: "Admin not found" });

    const members = await User.find({ email: { $in: memberEmails } });

    if (members.length !== memberEmails.length) {
      return res.status(400).json({ error: "One or more members not found" });
    }

    // Avoid duplicate admin in member list
    const memberIds = members.map(m => m._id);
    const uniqueMemberIds = new Set(memberIds);
    uniqueMemberIds.add(admin._id);

    const group = new Group({
      name,
      admin: admin._id,
      members: [...uniqueMemberIds],
    });

    await group.save();
    res.status(201).json(group);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Group creation failed" });
  }
};

const addMember = async (req, res) => {
  const { groupName, adminEmail, memberEmail } = req.body;

  try {
    const admin = await User.findOne({ email: adminEmail });
    const member = await User.findOne({ email: memberEmail });

    if (!admin || !member) {
      return res.status(404).json({ error: "Admin or member not found" });
    }

    const group = await Group.findOne({ name: groupName });
    if (!group) return res.status(404).json({ error: "Group not found" });

    if (!group.admin.equals(admin._id)) {
      return res.status(403).json({ error: "Only admin can add members" });
    }

    // 🔐 Check max members (10 including admin)
    const uniqueMemberIds = new Set(group.members.map(id => id.toString()));
    uniqueMemberIds.add(group.admin.toString()); // ensure admin is counted
    if (uniqueMemberIds.size >= 10) {
      return res.status(400).json({ error: "Group cannot have more than 10 members" });
    }

    // ✅ Add if not already in group
    if (!group.members.includes(member._id)) {
      group.members.push(member._id);
      await group.save();
    }

    res.status(200).json(group);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to add member" });
  }
};

const removeMember = async (req, res) => {
  const { groupName, adminEmail, memberEmail } = req.body;

  try {
    const admin = await User.findOne({ email: adminEmail });
    const member = await User.findOne({ email: memberEmail });

    if (!admin || !member) {
      return res.status(404).json({ error: "Admin or member not found" });
    }

    const group = await Group.findOne({ name: groupName });
    if (!group) return res.status(404).json({ error: "Group not found" });

    if (!group.admin.equals(admin._id)) {
      return res.status(403).json({ error: "Only admin can remove members" });
    }

    if (group.admin.equals(member._id)) {
      return res.status(400).json({ error: "Admin cannot remove themselves" });
    }

    // 🛑 Prevent removing if only one member would remain
    if (group.members.length <= 1) {
      return res.status(400).json({ error: "Group must have at least one member" });
    }

    group.members = group.members.filter(id => !id.equals(member._id));
    await group.save();

    res.status(200).json(group);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to remove member" });
  }
};

// // List Of All GRp
const getAllGroups = async (req, res) => {
  try {
    const groups = await Group.find()
      .populate("admin", "name email")
      .populate("members", "name email");

    res.status(200).json(groups);
  } catch (err) {
    console.error("Error fetching all groups:", err);
    res.status(500).json({ error: "Failed to fetch all groups" });
  }
};



// controllers/groupController.js

const getGroupMembers = async (req, res) => {
  const { groupName } = req.params;

  try {
    const group = await Group.findOne({ name: groupName })
      .populate("admin", "name email")
      .populate("members", "name email");

    if (!group) return res.status(404).json({ error: "Group not found" });

    res.status(200).json({
      groupName: group.name,
      admin: group.admin,
      members: group.members,
    });
  } catch (err) {
    console.error("Failed to fetch group members:", err);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

const getMyGroups = async (req, res) => {
  const { userEmail } = req.params;

  try {
    const user = await User.findOne({ email: userEmail });
    if (!user) return res.status(404).json({ error: "User not found" });

    const groups = await Group.find({
      $or: [
        { members: user._id },
        { admin: user._id }
      ]
    }).select("name admin members");

    res.status(200).json({ groups });
  } catch (err) {
    console.error("❌ Error in getMyGroups:", err.message);
    res.status(500).json({ error: "Failed to fetch groups" });
  }
};


export { createGroup, addMember, removeMember, getAllGroups, getGroupMembers, getMyGroups };
