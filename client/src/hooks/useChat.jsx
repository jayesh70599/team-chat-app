import { useState, useEffect, useContext } from "react";
import io from "socket.io-client";
import axios from "axios";
import { AuthContext } from "../context/AuthContext";

export const useChat = () => {
  const { user } = useContext(AuthContext);
  
  const [socket, setSocket] = useState(null);
  const [channels, setChannels] = useState([]);
  const [currentChannel, setCurrentChannel] = useState(null);
  const [channelMembers, setChannelMembers] = useState([]);
  const [messages, setMessages] = useState([]);
  const [isMember, setIsMember] = useState(false);
  const [loading, setLoading] = useState(false);

  const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || "http://localhost:5000";

  // 1. Socket Connection
  useEffect(() => {
    if (user) {
      const newSocket = io(BACKEND_URL, { query: { userId: user._id } });  
      //const newSocket = io("http://localhost:5000", { query: { userId: user._id } });
      setSocket(newSocket);
      return () => newSocket.close();
    }
  }, [user]);

  // 2. Socket Listeners
  useEffect(() => {
    if (!socket) return;

    socket.on("receive_message", (message) => {
      if (currentChannel && message.channel === currentChannel._id) {
        setMessages((prev) => [...prev, message]);
      }
    });

    socket.on("user_status_change", ({ userId, isOnline }) => {
      setChannelMembers((prev) =>
        prev.map((m) => (m._id === userId ? { ...m, isOnline } : m))
      );
    });

    return () => {
      socket.off("receive_message");
      socket.off("user_status_change");
    };
  }, [socket, currentChannel]);

  // 3. Initial Fetch
  useEffect(() => {
    fetchChannels();
  }, [currentChannel]);

  // --- Actions ---

  const fetchChannels = async () => {
    try {
      const res = await axios.get(`${BACKEND_URL}/api/channels`);
      setChannels(res.data);
    } catch (err) { console.error(err); }
  };

  const createChannel = async (name) => {
    try {
      const res = await axios.post(`${BACKEND_URL}/api/channels`, { name, userId: user._id });
      openChannel(res.data);
    } catch (err) { alert("Failed to create channel"); }
  };

  const openChannel = async (channel) => {
    if (socket) socket.emit("join_channel", channel._id);
    setCurrentChannel(channel);
    
    // Fetch details & history
    try {
      const [membersRes, msgsRes] = await Promise.all([
        axios.get(`${BACKEND_URL}/api/channels/${channel._id}`),
        axios.get(`${BACKEND_URL}/api/messages/${channel._id}`)
      ]);
      
      setChannelMembers(membersRes.data.members || []);
      setIsMember(membersRes.data.members.some(m => m._id === user._id));
      setMessages(msgsRes.data);
    } catch (err) { console.error(err); }
  };

  const joinChannel = async () => {
    if (!currentChannel) return;
    try {
      await axios.post(`${BACKEND_URL}/api/channels/${currentChannel._id}/join`, { userId: user._id });
      setIsMember(true);
      fetchChannels(); // Update counts
      // Refresh members
      const res = await axios.get(`${BACKEND_URL}/api/channels/${currentChannel._id}`);
      setChannelMembers(res.data.members || []);
    } catch (err) { console.error(err); }
  };

  const leaveChannel = async () => {
    if (!currentChannel) return;
    try {
      await axios.post(`${BACKEND_URL}/api/channels/${currentChannel._id}/leave`, { userId: user._id });
      setIsMember(false);
      fetchChannels();
      setCurrentChannel(null);
    } catch (err) { console.error(err); }
  };

  const sendMessage = (content) => {
    if (!content.trim() || !currentChannel || !socket) return;
    socket.emit("send_message", { sender: user._id, channel: currentChannel._id, content });
  };

  const fetchMoreMessages = async (beforeId) => {
    if (!currentChannel) return;
    setLoading(true);
    try {
      const res = await axios.get(`${BACKEND_URL}/api/messages/${currentChannel._id}`, { params: { before: beforeId } });
      if (res.data.length > 0) {
        setMessages((prev) => [...res.data, ...prev]);
      }
    } catch (err) { console.error(err); }
    finally { setLoading(false); }
  };

  return {
    socket, channels, currentChannel, channelMembers, messages, isMember, loading,
    createChannel, openChannel, joinChannel, leaveChannel, sendMessage, fetchMoreMessages
  };
};