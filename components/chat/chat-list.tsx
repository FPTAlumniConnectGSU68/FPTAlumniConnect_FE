import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import { cn } from "@/lib/utils";
import { ChatUser } from "./types";

// Mock data - In a real app, this would come from an API
const mockChats: ChatUser[] = [
  {
    id: "1",
    name: "John Doe",
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
  // Add more mock chats as needed
];

interface ChatListProps {
  onSelectChat: (chat: ChatUser) => void;
  activeChat?: ChatUser;
}

export default function ChatList({ onSelectChat, activeChat }: ChatListProps) {
  return (
    <div className="w-80 border max-h-[87vh] flex flex-col bg-white rounded-md mr-4">
      <div className="p-4 border-b">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
          <Input
            placeholder="Search conversations..."
            className="pl-10 bg-gray-50"
          />
        </div>
      </div>
      <div className="flex flex-col overflow-y-auto m-2 gap-2">
        {mockChats.map((chat) => (
          <div
            key={chat.id}
            className={cn(
              "p-4 hover:bg-red-50 cursor-pointer flex items-start gap-3 border rounded-md transition-colors duration-200",
              {
                "bg-red-100": activeChat?.id === chat.id,
              }
            )}
            onClick={() => onSelectChat(chat)}
          >
            <div className="relative">
              <Avatar>
                <AvatarImage src={chat.avatar} />
                <AvatarFallback>{chat.name[0]}</AvatarFallback>
              </Avatar>
              {chat.online && (
                <span className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-white" />
              )}
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex justify-between items-start">
                <h3 className="font-semibold truncate">{chat.name}</h3>
                <span className="text-xs text-gray-500">{chat.timestamp}</span>
              </div>
              <p className="text-sm text-gray-600 truncate">
                {chat.lastMessage}
              </p>
            </div>
            {chat.unreadCount && (
              <span className="bg-blue-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                {chat.unreadCount}
              </span>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
