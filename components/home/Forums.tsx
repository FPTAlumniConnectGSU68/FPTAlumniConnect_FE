import React from "react";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { TabsContent } from "@/components/ui/tabs";
import { MessageSquare, ArrowRight, Heart } from "lucide-react";

import { useRouter } from "next/navigation";
interface ForumProps {
  forumPosts: any[];
  handleClick: (param: any) => any;
}
const Forums = ({ forumPosts, handleClick }: ForumProps) => {
  const router = useRouter();
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-900">
          Popular Discussions
        </h2>
        <Button
          variant="outline"
          className="border-pink-200 text-pink-700 hover:bg-pink-50"
          onClick={() => router.push("/forums?openModal=true")}
        >
          Start Discussion
          <ArrowRight className="h-4 w-4 ml-2" />
        </Button>
      </div>
      <div className="space-y-4">
        {forumPosts.map((post, index) => (
          <Card
            key={index}
            className="hover:shadow-md transition-all duration-300 border border-gray-200 bg-white hover:border-pink-300"
            onClick={() => handleClick(post.postId)}
          >
            <CardContent className="pt-6">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    {/* <Badge
                      variant="secondary"
                      className="text-xs bg-pink-100 text-pink-800 border-pink-200"
                    >
                      {post.category}
                    </Badge>
                    <span className="text-xs text-gray-500">{post.time}</span> */}
                  </div>
                  <h3 className="font-semibold text-lg text-gray-900 mb-2">
                    {post.title}
                  </h3>
                  <p className="text-sm text-gray-600 mb-3">
                    in {post.majorName}
                  </p>
                  <div className="flex items-center gap-4 text-sm text-gray-500">
                    <div className="flex items-center">
                      <MessageSquare className="h-4 w-4 mr-1" />
                      {post.views} views
                    </div>
                    <div className="flex items-center">
                      {/* <Heart className="h-4 w-4 mr-1" />
                      {post.likes} likes */}
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default Forums;
