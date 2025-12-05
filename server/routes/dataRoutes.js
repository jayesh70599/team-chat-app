import express from "express";
import { getChannels, createChannel, joinChannel, getChannelDetails, leaveChannel } from "../controllers/channelController.js";
import { getMessages } from "../controllers/messageController.js";

const router = express.Router();

router.get("/channels", getChannels);
router.post("/channels", createChannel);
router.get("/channels/:id", getChannelDetails); // New
router.get("/messages/:channelId", getMessages);
router.post("/channels/:id/join", joinChannel);
router.post("/channels/:id/leave", leaveChannel);

export default router;