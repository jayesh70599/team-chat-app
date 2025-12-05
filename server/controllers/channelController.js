import Channel from "../models/Channel.js";
import User from "../models/User.js"; // Import User model

// @desc    Get all channels with member count
// @route   GET /api/channels
export const getChannels = async (req, res) => {
  try {
    const channels = await Channel.find({});
    // Return channel data plus the count of members
    const channelsWithCount = channels.map(c => ({
      _id: c._id,
      name: c.name,
      membersCount: c.members.length
    }));
    res.status(200).json(channelsWithCount);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch channels" });
  }
};

// @desc    Join a channel (Persist membership)
// @route   POST /api/channels/:id/join
export const joinChannel = async (req, res) => {
  try {
    const { id } = req.params;
    const { userId } = req.body;

    // Add user to members array if not already there
    await Channel.findByIdAndUpdate(id, { 
      $addToSet: { members: userId } 
    });

    res.status(200).json({ message: "Joined channel" });
  } catch (err) {
    res.status(500).json({ error: "Failed to join" });
  }
};

// @desc    Get channel details (Members & Online Status)
// @route   GET /api/channels/:id
export const getChannelDetails = async (req, res) => {
  try {
    const { id } = req.params;
    const channel = await Channel.findById(id).populate("members", "username isOnline");
    res.status(200).json(channel);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch channel details" });
  }
};

// Create channel (Keep your existing one, but ensure creator is added as member)
export const createChannel = async (req, res) => {
    try {
      const { name, userId } = req.body; // Ensure userId is passed from frontend
      if (!name) return res.status(400).json({ error: "Channel name is required" });
  
      const newChannel = await Channel.create({ 
          name, 
          members: userId ? [userId] : [] // Creator is first member
      });
      res.status(201).json(newChannel);
    } catch (err) {
      res.status(500).json({ error: "Failed to create channel" });
    }
  };

// @desc    Leave a channel
// @route   POST /api/channels/:id/leave
export const leaveChannel = async (req, res) => {
  try {
    const { id } = req.params;
    const { userId } = req.body;

    // Remove user from members array
    await Channel.findByIdAndUpdate(id, { 
      $pull: { members: userId } 
    });

    res.status(200).json({ message: "Left channel" });
  } catch (err) {
    res.status(500).json({ error: "Failed to leave channel" });
  }
};