"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { CirclePlus, MessageSquare, Pin, Plus, TrendingUp } from "lucide-react";
import { useRouter } from "next/navigation";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Bookmark, Search } from "lucide-react";
import { useAuthGuard } from "@/hooks/use-auth-guard";
import { useState } from "react";
import CreateNewDiscussionModal from "@/components/forum/CreateNewDiscussionModal";

const categories = [
  {
    id: 1,
    name: "Career Development",
    slug: "career-development",
    description:
      "Discuss career growth, job opportunities, and professional development",
    topics: 156,
    posts: 1240,
    lastActivity: "2 hours ago",
    color: "bg-blue-100 text-blue-800",
  },
  {
    id: 2,
    name: "Technology & Innovation",
    slug: "technology-innovation",
    description:
      "Share insights about latest tech trends, tools, and innovations",
    topics: 89,
    posts: 567,
    lastActivity: "1 hour ago",
    color: "bg-green-100 text-green-800",
  },
  {
    id: 3,
    name: "Entrepreneurship",
    slug: "entrepreneurship",
    description:
      "Connect with fellow entrepreneurs and discuss startup experiences",
    topics: 67,
    posts: 423,
    lastActivity: "3 hours ago",
    color: "bg-purple-100 text-purple-800",
  },
  {
    id: 4,
    name: "Class Reunions",
    slug: "class-reunions",
    description: "Organize and discuss class reunions and alumni gatherings",
    topics: 45,
    posts: 234,
    lastActivity: "5 hours ago",
    color: "bg-orange-100 text-orange-800",
  },
  {
    id: 5,
    name: "Study Abroad",
    slug: "study-abroad",
    description:
      "Share experiences and advice about studying and working abroad",
    topics: 78,
    posts: 456,
    lastActivity: "4 hours ago",
    color: "bg-pink-100 text-pink-800",
  },
  {
    id: 6,
    name: "General Discussion",
    slug: "general-discussion",
    description: "Open discussions about life, hobbies, and general topics",
    topics: 123,
    posts: 890,
    lastActivity: "30 minutes ago",
    color: "bg-gray-100 text-gray-800",
  },
];

const recentTopics = [
  {
    id: 1,
    title: "Best practices for remote work in tech companies",
    author: "Nguyen Van An",
    authorClass: "Class of 2018",
    category: "Career Development",
    replies: 23,
    views: 156,
    lastReply: "2 hours ago",
    isPinned: false,
    isHot: true,
  },
  {
    id: 2,
    title: "AI and Machine Learning career opportunities in Vietnam",
    author: "Tran Thi Binh",
    authorClass: "Class of 2019",
    category: "Technology & Innovation",
    replies: 18,
    views: 234,
    lastReply: "1 hour ago",
    isPinned: true,
    isHot: true,
  },
  {
    id: 3,
    title: "Starting a tech startup in Southeast Asia - Lessons learned",
    author: "Le Minh Duc",
    authorClass: "Class of 2017",
    category: "Entrepreneurship",
    replies: 31,
    views: 445,
    lastReply: "3 hours ago",
    isPinned: false,
    isHot: true,
  },
  {
    id: 4,
    title: "Class of 2020 - 5 year reunion planning",
    author: "Pham Thu Ha",
    authorClass: "Class of 2020",
    category: "Class Reunions",
    replies: 12,
    views: 89,
    lastReply: "5 hours ago",
    isPinned: false,
    isHot: false,
  },
  {
    id: 5,
    title: "Working in Singapore as an FPT graduate - AMA",
    author: "Hoang Van Khai",
    authorClass: "Class of 2016",
    category: "Study Abroad",
    replies: 27,
    views: 312,
    lastReply: "4 hours ago",
    isPinned: false,
    isHot: true,
  },
];
export default function ForumsPage() {
  const router = useRouter();
  const { requireAuth, AuthGuard } = useAuthGuard();
  const [openCreateNewDiscussion, setOpenCreateNewDiscussion] = useState(false);
  const handleStartNewDiscussion = () => {
    if (
      !requireAuth({
        title: "Start a New Discussion",
        description:
          "Sign in to start a new discussion and connect with fellow FPT alumni",
        actionText: "start a new discussion",
      })
    )
      return;
    setOpenCreateNewDiscussion(true);
  };
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Hero Section */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Alumni Forums
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto mb-8">
            Connect, share experiences, and engage in meaningful discussions
            with fellow FPT alumni.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Categories */}
            <Card>
              <CardHeader>
                <CardTitle>Discussion Categories</CardTitle>
                <CardDescription>
                  Choose a category to explore topics and join conversations
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <CommandDesktop />
                {categories.map((category) => (
                  <div
                    key={category.id}
                    className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50 transition-colors cursor-pointer"
                    onClick={() => router.push(`/forums/${category.slug}`)}
                  >
                    <div className="flex-1">
                      <div className="flex items-center space-x-3 mb-2">
                        <Badge className={category.color}>
                          {category.name}
                        </Badge>
                      </div>
                      <p className="text-sm text-gray-600 mb-2">
                        {category.description}
                      </p>
                      <div className="flex items-center space-x-4 text-xs text-gray-500">
                        <span>{category.topics} topics</span>
                        <span>{category.posts} posts</span>
                        <span>Last activity: {category.lastActivity}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Recent Topics */}
            <Card>
              <CardHeader>
                <CardTitle>Recent Discussions</CardTitle>
                <CardDescription>
                  Latest topics and active conversations
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {recentTopics.map((topic) => (
                  <div
                    key={topic.id}
                    className="border-b last:border-b-0 pb-4 last:pb-0"
                  >
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex-1">
                        <div className="flex items-center space-x-2 mb-1">
                          {topic.isPinned && (
                            <Pin className="h-4 w-4 text-blue-600" />
                          )}
                          {topic.isHot && (
                            <TrendingUp className="h-4 w-4 text-red-500" />
                          )}
                          <h3 className="font-medium text-gray-900 hover:text-blue-600 cursor-pointer">
                            {topic.title}
                          </h3>
                        </div>
                        <div className="flex items-center space-x-4 text-sm text-gray-500">
                          <span>
                            by {topic.author} ({topic.authorClass})
                          </span>
                          <Badge variant="outline" className="text-xs">
                            {topic.category}
                          </Badge>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center justify-between text-sm text-gray-500">
                      <div className="flex items-center space-x-4">
                        <div className="flex items-center space-x-1">
                          <MessageSquare className="h-4 w-4" />
                          <span>{topic.replies} replies</span>
                        </div>
                        <span>{topic.views} views</span>
                      </div>
                      <span>Last reply: {topic.lastReply}</span>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Create new forum card */}
            <Button
              size="lg"
              className="bg-gradient-to-r from-blue-600 to-purple-600 w-full"
              onClick={handleStartNewDiscussion}
            >
              <CirclePlus className="h-4 w-4" />
              Start a New Discussion
            </Button>
            {/* Active Contributors */}
            <Card>
              <CardHeader>
                <CardTitle>Top Contributors</CardTitle>
                <CardDescription>
                  Most active forum members this month
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {[
                  { name: "Nguyen Van An", class: "2018", posts: 45 },
                  { name: "Tran Thi Binh", class: "2019", posts: 38 },
                  { name: "Le Minh Duc", class: "2017", posts: 32 },
                  { name: "Pham Thu Ha", class: "2020", posts: 28 },
                ].map((contributor, index) => (
                  <div key={index} className="flex items-center space-x-3">
                    <Avatar className="h-8 w-8">
                      <AvatarImage
                        src={`/placeholder.svg?height=32&width=32`}
                      />
                      <AvatarFallback>
                        {contributor.name
                          .split(" ")
                          .map((name) => name[0])
                          .join("")}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <p className="text-sm font-medium">{contributor.name}</p>
                      <p className="text-xs text-gray-500">
                        Class of {contributor.class}
                      </p>
                    </div>
                    <Badge variant="secondary" className="text-xs">
                      {contributor.posts} posts
                    </Badge>
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Forum Guidelines */}
            <Card>
              <CardHeader>
                <CardTitle>Forum Guidelines</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2 text-sm text-gray-600">
                <p>• Be respectful and professional</p>
                <p>• Stay on topic in discussions</p>
                <p>• No spam or self-promotion</p>
                <p>• Help maintain a positive community</p>
                <Button variant="outline" size="sm" className="w-full mt-4">
                  Read Full Guidelines
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
      <AuthGuard />
      <CreateNewDiscussionModal
        isOpen={openCreateNewDiscussion}
        onClose={() => setOpenCreateNewDiscussion(false)}
      />
    </div>
  );
}

const CommandDesktop = () => {
  return (
    <div className="flex items-center gap-2 mb-6">
      {/* Topic Filter */}
      <Select defaultValue="all">
        <SelectTrigger className="w-[10rem] bg-white border-gray-200">
          <SelectValue placeholder="Topic" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All Topics</SelectItem>
          <SelectItem value="tech">Technology</SelectItem>
          <SelectItem value="career">Career</SelectItem>
          <SelectItem value="education">Education</SelectItem>
          <SelectItem value="events">Events</SelectItem>
        </SelectContent>
      </Select>

      {/* Sort Filter */}
      <Select defaultValue="recent">
        <SelectTrigger className="w-[10rem] bg-white border-gray-200">
          <SelectValue placeholder="Sort" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="recent">Most Recent</SelectItem>
          <SelectItem value="popular">Most Popular</SelectItem>
          <SelectItem value="comments">Most Comments</SelectItem>
          <SelectItem value="likes">Most Likes</SelectItem>
        </SelectContent>
      </Select>

      {/* Bookmarks Button */}
      <Button variant="outline" size="icon" className="bg-white">
        <Bookmark className="h-4 w-4" />
      </Button>

      {/* Search Input */}
      <div className="relative flex-1">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
        <Input
          placeholder="Search forums..."
          className="pl-10 bg-white border-gray-200"
        />
      </div>
    </div>
  );
};
