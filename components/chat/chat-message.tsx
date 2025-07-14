import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";

interface MessageUser {
  name: string;
  avatar?: string;
  role: "student" | "alumni";
}

interface ChatMessageProps {
  content: string;
  timestamp: string;
  isMe: boolean;
  user: MessageUser;
}

export default function ChatMessage({
  content,
  timestamp,
  isMe,
  user,
}: ChatMessageProps) {
  return (
    <div
      className={cn("flex gap-3 mb-4", {
        "flex-row-reverse": isMe,
      })}
    >
      <Avatar className="h-8 w-8">
        <AvatarImage src={user.avatar} />
        <AvatarFallback>{user.name[0]}</AvatarFallback>
      </Avatar>
      <div
        className={cn("flex flex-col max-w-[70%]", {
          "items-end": isMe,
        })}
      >
        <div
          className={cn("rounded-2xl px-4 py-2", {
            "bg-blue-500 text-white": isMe,
            "bg-gray-100": !isMe,
          })}
        >
          <p className="text-sm whitespace-pre-wrap">{content}</p>
        </div>
        <span className="text-xs text-gray-500 mt-1">{timestamp}</span>
      </div>
    </div>
  );
}
