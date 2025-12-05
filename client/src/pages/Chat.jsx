import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import { useChat } from "../hooks/useChat";
import ChannelSidebar from "../components/ChannelSidebar";
import ChatArea from "../components/ChatArea";
import MemberSidebar from "../components/MemberSidebar";

const Chat = () => {
  const { user, logout } = useContext(AuthContext);
  const chat = useChat(); // All logic comes from here

  return (
    <div className="flex h-screen bg-gray-100 font-sans">
      <ChannelSidebar 
        channels={chat.channels} 
        currentChannel={chat.currentChannel} 
        onOpen={chat.openChannel} 
        onCreate={chat.createChannel}
        onLogout={logout}
      />

      <ChatArea 
        currentChannel={chat.currentChannel}
        messages={chat.messages}
        user={user}
        socket={chat.socket}
        isMember={chat.isMember}
        loading={chat.loading}
        onJoin={chat.joinChannel}
        onLeave={chat.leaveChannel}
        onSendMessage={chat.sendMessage}
        onLoadMore={chat.fetchMoreMessages}
      />

      {chat.currentChannel && (
        <MemberSidebar 
          members={chat.channelMembers} 
          currentUser={user} 
        />
      )}
    </div>
  );
};

export default Chat;