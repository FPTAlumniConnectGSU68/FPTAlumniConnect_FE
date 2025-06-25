"use client";

import { useParams } from "next/navigation";
import { useState } from "react";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { MessageCircle, ThumbsUp, Share2 } from "lucide-react";
import { useAuthGuard } from "@/hooks/use-auth-guard";

const mockThreads = [
  {
    id: 1,
    title: "How to prepare for technical interviews?",
    content:
      "I have an upcoming technical interview at a big tech company. Any tips on how to prepare effectively? I'm particularly interested in system design and algorithm questions.",
    author: {
      name: "John Doe",
      avatar: "/placeholder-user.jpg",
      role: "Software Engineer",
    },
    createdAt: "2024-03-15T10:00:00Z",
    likes: 24,
    comments: [
      {
        id: 1,
        content:
          "Focus on data structures and algorithms. LeetCode is your friend!",
        author: {
          name: "Jane Smith",
          avatar: "/placeholder-user.jpg",
          role: "Senior Developer",
        },
        createdAt: "2024-03-15T11:30:00Z",
      },
    ],
  },
  {
    id: 2,
    title: "Career transition to Data Science",
    content:
      "I'm currently working as a software developer but interested in transitioning to data science. What skills should I focus on? Any recommended learning resources?",
    author: {
      name: "Alice Johnson",
      avatar: "/placeholder-user.jpg",
      role: "Software Developer",
    },
    createdAt: "2024-03-14T15:20:00Z",
    likes: 18,
    comments: [],
  },
];

interface Thread {
  id: number;
  title: string;
  content: string;
  author: {
    name: string;
    avatar: string;
    role: string;
  };
  createdAt: string;
  likes: number;
  comments: {
    id: number;
    content: string;
    author: {
      name: string;
      avatar: string;
      role: string;
    };
    createdAt: string;
  }[];
}

export default function ForumDetail() {
  const { forum_slug } = useParams();
  const [selectedThread, setSelectedThread] = useState<Thread | null>(null);
  const [newComment, setNewComment] = useState("");
  const { requireAuth, AuthGuard } = useAuthGuard();

  const formatSlug = (slug: string): string => {
    return slug
      .split("-")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const handleAddComment = () => {
    if (!newComment.trim()) return;

    // In a real app, this would be an API call
    console.log("Adding comment:", newComment);
    setNewComment("");
  };

  const handleStartNewTopicClick = () => {
    if (
      !requireAuth({
        title: "Create New Thread",
        description:
          "Sign in to create a new thread and connect with FPT University alumni",
        actionText: "create a new thread",
      })
    )
      return;
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-2xl font-bold text-gray-900">
            {formatSlug(forum_slug as string)}
          </h1>
          <Button
            size="sm"
            className="bg-gradient-to-r from-blue-600 to-purple-600"
            onClick={handleStartNewTopicClick}
          >
            Create New Thread
          </Button>
        </div>

        {/* Threads List */}
        <div className="space-y-4">
          {mockThreads.map((thread) => (
            <div
              key={thread.id}
              className="relative group"
              onClick={() => setSelectedThread(thread)}
            >
              {/* Animated border */}
              <div className="absolute -inset-[1px] rounded-lg bg-gradient-to-r from-blue-600 to-purple-600 opacity-0 group-hover:opacity-100 blur-sm group-hover:blur transition duration-500" />
              <div className="absolute -inset-[1px] rounded-lg bg-gradient-to-r from-blue-600 to-purple-600 opacity-0 group-hover:opacity-75 animate-gradient-x" />

              {/* Card Content */}
              <div className="relative bg-white rounded-lg shadow p-6 cursor-pointer hover:shadow-md transition-shadow">
                <div className="flex items-start gap-4">
                  <Avatar>
                    <AvatarImage src={thread.author.avatar} />
                    <AvatarFallback>{thread.author.name[0]}</AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-gray-900">
                      {thread.title}
                    </h3>
                    <p className="text-sm text-gray-500 mt-1">
                      Posted by {thread.author.name} •{" "}
                      {formatDate(thread.createdAt)}
                    </p>
                    <p className="text-gray-600 mt-2 line-clamp-2">
                      {thread.content}
                    </p>
                    <div className="flex items-center gap-6 mt-4">
                      <div className="flex items-center gap-2 text-gray-500">
                        <ThumbsUp className="h-4 w-4" />
                        <span>{thread.likes}</span>
                      </div>
                      <div className="flex items-center gap-2 text-gray-500">
                        <MessageCircle className="h-4 w-4" />
                        <span>{thread.comments.length}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Thread Dialog */}
        <Dialog
          open={!!selectedThread}
          onOpenChange={() => setSelectedThread(null)}
        >
          <DialogContent className="max-w-2xl">
            <DialogTitle>{"Thread Detail"}</DialogTitle>
            {selectedThread && (
              <div className="space-y-6">
                {/* Thread Header */}
                <div className="space-y-4">
                  <div className="flex items-start gap-4">
                    <Avatar>
                      <AvatarImage src={selectedThread.author.avatar} />
                      <AvatarFallback>
                        {selectedThread.author.name[0]}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <h2 className="text-xl font-semibold">
                        {selectedThread.title}
                      </h2>
                      <p className="text-sm text-gray-500">
                        Posted by {selectedThread.author.name} •{" "}
                        {formatDate(selectedThread.createdAt)}
                      </p>
                    </div>
                  </div>
                  <p className="text-gray-700">{selectedThread.content}</p>
                  <div className="flex items-center gap-6 pt-2 border-t">
                    <Button variant="ghost" size="sm" className="gap-2">
                      <ThumbsUp className="h-4 w-4" />
                      Like ({selectedThread.likes})
                    </Button>
                    <Button variant="ghost" size="sm" className="gap-2">
                      <Share2 className="h-4 w-4" />
                      Share
                    </Button>
                  </div>
                </div>

                {/* Comments Section */}
                <div className="space-y-4">
                  <h3 className="font-semibold">
                    Comments ({selectedThread.comments.length})
                  </h3>

                  {/* Add Comment */}
                  <div className="flex gap-4">
                    <Avatar>
                      <AvatarImage src="/placeholder-user.jpg" />
                      <AvatarFallback>U</AvatarFallback>
                    </Avatar>
                    <div className="flex-1 space-y-2">
                      <Input
                        placeholder="Add a comment..."
                        value={newComment}
                        onChange={(e) => setNewComment(e.target.value)}
                      />
                      <Button
                        onClick={handleAddComment}
                        disabled={!newComment.trim()}
                      >
                        Comment
                      </Button>
                    </div>
                  </div>

                  {/* Comments List */}
                  <div className="space-y-4 mt-6">
                    {selectedThread.comments.map((comment) => (
                      <div key={comment.id} className="flex gap-4">
                        <Avatar>
                          <AvatarImage src={comment.author.avatar} />
                          <AvatarFallback>
                            {comment.author.name[0]}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="font-medium">
                              {comment.author.name}
                            </span>
                            <span className="text-sm text-gray-500">
                              {formatDate(comment.createdAt)}
                            </span>
                          </div>
                          <p className="text-gray-700 mt-1">
                            {comment.content}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </DialogContent>
        </Dialog>
        <AuthGuard />
      </div>
    </div>
  );
}
