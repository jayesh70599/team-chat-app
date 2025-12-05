import Message from "../models/Message.js";

// @desc    Get messages for a specific channel
// @route   GET /api/messages/:channelId
export const getMessages = async (req, res) => {
  try {
    const { channelId } = req.params;
    const { limit = 20, before } = req.query; // 'before' is a timestamp or ID

    const query = { channel: channelId };
    
    // If we are paging back, only get messages OLDER than 'before'
    if (before) {
      query._id = { $lt: before };
    }

    const messages = await Message.find(query)
      .populate("sender", "username email")
      .sort({ createdAt: -1 }) // Get NEWEST first
      .limit(parseInt(limit));

    // Reverse them so they appear chronologically in chat
    res.status(200).json(messages.reverse());
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch messages" });
  }
};