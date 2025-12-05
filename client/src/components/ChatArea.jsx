import { useState, useRef, useLayoutEffect, useEffect } from "react";

const ChatArea = ({ 
  currentChannel, messages, user, socket, isMember, loading, 
  onJoin, onLeave, onSendMessage, onLoadMore 
}) => {
  const [newMessage, setNewMessage] = useState("");
  
  // Refs for scrolling logic
  const bottomRef = useRef();
  const chatContainerRef = useRef();
  const prevScrollHeightRef = useRef(null);
  const latestMessageIdRef = useRef(null); // NEW: Tracks the ID of the newest message

  // 1. SCROLL RESTORATION (Maintenance)
  // Maintains scroll position when older messages load at the top
  useLayoutEffect(() => {
    if (prevScrollHeightRef.current && chatContainerRef.current) {
        const newScrollHeight = chatContainerRef.current.scrollHeight;
        const heightDifference = newScrollHeight - prevScrollHeightRef.current;
        chatContainerRef.current.scrollTop = heightDifference;
        prevScrollHeightRef.current = null;
    }
  }, [messages]);

  // 2. AUTO-SCROLL (Bottom)
  // Only scrolls to bottom if the *newest* message has changed
  useEffect(() => {
    if (messages.length > 0) {
      const newestMessage = messages[messages.length - 1];
      
      // Check if the newest message is different from what we last saw
      if (newestMessage._id !== latestMessageIdRef.current) {
        latestMessageIdRef.current = newestMessage._id;
        bottomRef.current?.scrollIntoView({ behavior: "smooth" });
      }
    }
  }, [messages]);

  const handleScroll = (e) => {
    // If we hit the top, capture the current height and load more
    if (e.target.scrollTop === 0 && !loading && messages.length > 0) {
        prevScrollHeightRef.current = e.target.scrollHeight;
        onLoadMore(messages[0]._id);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSendMessage(newMessage);
    setNewMessage("");
  };

  if (!currentChannel) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center text-gray-500 bg-gray-50">
        <h3 className="text-xl font-medium text-gray-700">Welcome to TeamChat</h3>
        <p className="mt-2 text-sm">Select a channel to join.</p>
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col min-w-0 bg-white">
      {/* Header */}
      <div className="h-16 px-6 border-b flex items-center justify-between bg-white shadow-sm z-10">
        <div>
          <h2 className="text-lg font-bold text-gray-800"># {currentChannel.name}</h2>
          <div className={`text-xs flex items-center gap-1 ${socket?.connected ? "text-green-600" : "text-red-500"}`}>
             <span className={`w-2 h-2 rounded-full ${socket?.connected ? "bg-green-500" : "bg-red-500"}`}></span>
             {socket?.connected ? "Connected" : "Reconnecting..."}
          </div>
        </div>
        <div>
          {isMember ? (
            <button onClick={onLeave} className="text-xs bg-red-100 text-red-600 hover:bg-red-200 px-3 py-1.5 rounded border border-red-200 font-medium transition">Leave Channel</button>
          ) : (
            <button onClick={onJoin} className="text-xs bg-indigo-600 text-white hover:bg-indigo-700 px-4 py-1.5 rounded font-bold transition shadow-sm">Join Channel</button>
          )}
        </div>
      </div>

      {/* Messages */}
      <div ref={chatContainerRef} onScroll={handleScroll} className="flex-1 overflow-y-auto p-6 space-y-4 bg-gray-50">
        {loading && <div className="text-center text-xs text-gray-400 py-2">Loading older messages...</div>}
        
        {messages.map((msg, index) => {
          const isMe = msg.sender?._id === user._id;
          return (
            <div key={index} className={`flex ${isMe ? "justify-end" : "justify-start"}`}>
              <div className={`max-w-[70%] px-4 py-2.5 rounded-2xl shadow-sm text-sm ${isMe ? "bg-indigo-600 text-white rounded-br-none" : "bg-white text-gray-800 border border-gray-200 rounded-bl-none"}`}>
                {!isMe && <div className="text-xs font-bold text-indigo-600 mb-1">{msg.sender?.username || "Unknown"}</div>}
                <p className="leading-relaxed">{msg.content}</p>
                <div className={`text-[10px] text-right mt-1 ${isMe ? "text-indigo-200" : "text-gray-400"}`}>
                  {new Date(msg.createdAt || Date.now()).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </div>
              </div>
            </div>
          );
        })}
        <div ref={bottomRef} />
      </div>

      {/* Input */}
      <div className="p-4 bg-white border-t">
        <form onSubmit={handleSubmit} className="flex gap-2 max-w-4xl mx-auto">
          <input 
            type="text" 
            className={`flex-1 border border-gray-300 px-4 py-2.5 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 transition ${!isMember ? "bg-gray-100 cursor-not-allowed" : ""}`}
            placeholder={isMember ? `Message #${currentChannel.name}` : "Join channel to message"}
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            disabled={!isMember}
          />
          <button type="submit" disabled={!isMember} className={`px-6 py-2.5 rounded-lg font-medium transition shadow-sm ${isMember ? "bg-indigo-600 text-white hover:bg-indigo-700" : "bg-gray-300 text-gray-500 cursor-not-allowed"}`}>Send</button>
        </form>
      </div>
    </div>
  );
};

export default ChatArea;