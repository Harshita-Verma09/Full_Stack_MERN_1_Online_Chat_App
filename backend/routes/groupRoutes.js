import express from "express";
import {
    createGroup,
    addMember,
    removeMember,
    getAllGroups,
    getGroupMembers,
    getMyGroups
} from "../controllers/groupControllers.js";
import {
    sendGroupMessage,
    getGroupMessages,
} from "../controllers/groupMessageControllers.js";

const router = express.Router();


router.post("/create-group", createGroup);
router.get("/all-groups", getAllGroups); // <-- ADD THIS

router.post("/add-member", addMember);
router.post("/remove-member", removeMember);
router.get("/:groupName/all-members", getGroupMembers);

// group chat
router.post("/:groupName/messages", sendGroupMessage);
router.get("/:groupName/messages", getGroupMessages);
router.get("/my-groups/:userEmail", getMyGroups);



export default router;

