import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Send, Image, Paperclip, Smile } from "lucide-react";
import ChatMessage from "./chat-message";
import { ChatUser } from "./types";

interface Message {
  id: string;
  content: string;
  timestamp: string;
  user: {
    id: string;
    name: string;
    avatar: string;
    role: "student" | "alumni";
  };
}

// Mock conversation between a student and an alumni
const mockMessages: Message[] = [
  {
    id: "1",
    content:
      "Hi! I'm a final year student in Software Engineering. I saw from your profile that you're working at Google. Would you mind sharing some advice about preparing for tech interviews?",
    timestamp: "2:30 PM",
    user: {
      id: "student_1",
      name: "Nguyen Van A",
      avatar: "/placeholder-user.jpg",
      role: "student",
    },
  },
  {
    id: "2",
    content:
      "Hello! Of course, I'd be happy to help. I went through the tech interview process at several companies. What specific areas are you looking to focus on?",
    timestamp: "2:32 PM",
    user: {
      id: "alumni_1",
      name: "Tran Thi B",
      avatar: "/placeholder-user.jpg",
      role: "alumni",
    },
  },
  {
    id: "3",
    content:
      "Thank you! I'm particularly interested in system design. I'm working on a final project that's a real-time chat application, and I want to make sure I'm following best practices.",
    timestamp: "2:33 PM",
    user: {
      id: "student_1",
      name: "Nguyen Van A",
      avatar: "/placeholder-user.jpg",
      role: "student",
    },
  },
  {
    id: "4",
    content:
      "That's a great project choice! For system design, especially for real-time applications, you'll want to consider: \n1. Scalability - WebSocket connections\n2. Message persistence\n3. Delivery guarantees\n4. Presence management (online/offline status)",
    timestamp: "2:35 PM",
    user: {
      id: "alumni_1",
      name: "Tran Thi B",
      avatar: "/placeholder-user.jpg",
      role: "alumni",
    },
  },
  {
    id: "5",
    content:
      "Would you be willing to look at my current architecture diagram? I can share it here.",
    timestamp: "2:36 PM",
    user: {
      id: "student_1",
      name: "Nguyen Van A",
      avatar: "/placeholder-user.jpg",
      role: "student",
    },
  },
  {
    id: "6",
    content:
      "Of course! Feel free to share it. I can also schedule a call to discuss it in more detail if you'd like.",
    timestamp: "2:37 PM",
    user: {
      id: "alumni_1",
      name: "Tran Thi B",
      avatar: "/placeholder-user.jpg",
      role: "alumni",
    },
  },
  {
    id: "7",
    content: "That would be amazing! When are you usually free?",
    timestamp: "2:37 PM",
    user: {
      id: "student_1",
      name: "Nguyen Van A",
      avatar: "/placeholder-user.jpg",
      role: "student",
    },
  },
  {
    id: "8",
    content:
      "I'm usually available on weekends or after 6 PM on weekdays. We could set up a meeting this Saturday if that works for you?",
    timestamp: "2:38 PM",
    user: {
      id: "alumni_1",
      name: "Tran Thi B",
      avatar: "/placeholder-user.jpg",
      role: "alumni",
    },
  },
];

interface ChatWindowProps {
  chat: ChatUser;
  handleSendMessage: () => void;
  newMessage: string;
  setNewMessage: (message: string) => void;
}

export default function ChatWindow({
  chat,
  handleSendMessage,
  newMessage,
  setNewMessage,
}: ChatWindowProps) {
  const currentUserId = "student_1"; // In a real app, this would come from auth context

  return (
    <div className="flex-1 flex flex-col max-h-[87vh] border rounded-md bg-white relative">
      {/* Chat Header */}
      <div className="p-4 border-b flex items-center gap-3">
        <Avatar>
          <AvatarImage src={chat.avatar} />
          <AvatarFallback>{chat.name[0]}</AvatarFallback>
        </Avatar>
        <div className="flex-1">
          <h2 className="font-semibold">{chat.name}</h2>
          <p className="text-sm text-gray-500">
            {chat.online ? "Online" : "Offline"}
          </p>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-scroll p-4 mb-10">
        {mockMessages.map((message) => (
          <ChatMessage
            key={message.id}
            content={message.content}
            timestamp={message.timestamp}
            isMe={message.user.id === currentUserId}
            user={message.user}
          />
        ))}
      </div>

      {/* Message Input */}
      <div className="p-4 border-t absolute bottom-0 bg-white rounded-md right-0 left-0">
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="icon">
            <Paperclip className="h-5 w-5 text-gray-500" />
          </Button>
          <Button variant="ghost" size="icon">
            <Image className="h-5 w-5 text-gray-500" />
          </Button>
          <Input
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            placeholder="Type a message..."
            className="flex-1"
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                handleSendMessage();
              }
            }}
          />
          <Button variant="ghost" size="icon">
            <Smile className="h-5 w-5 text-gray-500" />
          </Button>
          <Button
            onClick={handleSendMessage}
            disabled={!newMessage.trim()}
            size="icon"
          >
            <Send className="h-5 w-5" />
          </Button>
        </div>
      </div>
    </div>
  );
}
