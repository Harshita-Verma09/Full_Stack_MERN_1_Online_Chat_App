import express from "express";
import { talkToAI, getAIHistory } from "../controllers/aiController.js"; //Add .js

const router = express.Router();

router.post("/talk", talkToAI);
router.get("/history/:userId", getAIHistory);

export default router;
