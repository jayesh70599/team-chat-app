import { useState } from "react";

const ChannelSidebar = ({ channels, currentChannel, onOpen, onCreate, onLogout }) => {
  const [newChannelName, setNewChannelName] = useState("");

  const handleCreate = () => {
    if (newChannelName) {
      onCreate(newChannelName);
      setNewChannelName("");
    }
  };

  return (
    <div className="w-64 bg-gray-900 text-white flex flex-col flex-shrink-0">
      <div className="p-4 border-b border-gray-700 flex justify-between items-center">
        <h1 className="text-xl font-bold tracking-wider">TeamChat</h1>
        <button onClick={onLogout} className="text-xs bg-red-600 px-2 py-1 rounded">Logout</button>
      </div>
      
      <div className="flex-1 overflow-y-auto p-2 space-y-1">
        <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2 px-2">Channels</h3>
        {channels.map((channel) => (
          <div 
            key={channel._id}
            onClick={() => onOpen(channel)}
            className={`px-3 py-2 rounded cursor-pointer hover:bg-gray-800 flex justify-between items-center ${currentChannel?._id === channel._id ? "bg-gray-800 text-white" : "text-gray-400"}`}
          >
            <span className="truncate"># {channel.name}</span>
            {channel.membersCount > 0 && <span className="text-xs bg-gray-700 px-1.5 rounded-full">{channel.membersCount}</span>}
          </div>
        ))}
      </div>

      <div className="p-4 border-t border-gray-700">
        <div className="flex gap-2">
          <input 
            type="text" 
            placeholder="New Channel" 
            className="w-full bg-gray-800 text-white px-3 py-1.5 rounded text-sm focus:outline-none"
            value={newChannelName}
            onChange={(e) => setNewChannelName(e.target.value)}
          />
          <button onClick={handleCreate} className="bg-indigo-600 px-3 rounded text-lg font-bold">+</button>
        </div>
      </div>
    </div>
  );
};

export default ChannelSidebar;