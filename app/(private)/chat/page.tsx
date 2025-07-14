"use client";

import { useAuth } from "@/contexts/auth-context";
import ChatList from "@/components/chat/chat-list";
import { useState } from "react";
import ChatWindow from "@/components/chat/chat-window";
import { ChatUser } from "@/components/chat/types";

// Mock messages - In a real app, this would come from an API
const mockChats: ChatUser[] = [
  {
    id: "1",
    name: "Alice Smith",
    avatar: "/placeholder-user.jpg",
    lastMessage: "Hey, how's your project going?",
    timestamp: "2m ago",
    unreadCount: 2,
    online: true,
  },
  {
    id: "2",
    name: "Alice Smith",
    avatar: "/placeholder-user.jpg",
    lastMessage: "Thanks for the help!",
    timestamp: "1h ago",
    online: false,
  },
  {
    id: "3",
    name: "Alice Smith",
    avatar: "/placeholder-user.jpg",
    lastMessage:
      "That's great! I'm actually looking for some help with a technical problem. Would you have some time to discuss?",
    timestamp: "1h ago",
    online: false,
  },
];

export default function ChatPage() {
  const { user } = useAuth();
  const [newMessage, setNewMessage] = useState("");
  const [activeChat, setActiveChat] = useState<ChatUser>(mockChats[0]);

  const handleSendMessage = () => {
    if (!newMessage.trim()) return;
    // In a real app, this would send the message to an API
    console.log("Sending message:", newMessage);
    setNewMessage("");
  };

  const handleSelectChat = (chat: ChatUser) => {
    setActiveChat(chat);
  };

  return (
    <div className="flex">
      <ChatList onSelectChat={handleSelectChat} activeChat={activeChat} />
      <ChatWindow
        chat={activeChat}
        handleSendMessage={handleSendMessage}
        newMessage={newMessage}
        setNewMessage={setNewMessage}
      />
    </div>
  );
}
