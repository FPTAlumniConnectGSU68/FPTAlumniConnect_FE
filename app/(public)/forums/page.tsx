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
import { CirclePlus, MessageSquare, Share2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Bookmark, Search } from "lucide-react";
import { useAuthGuard } from "@/hooks/use-auth-guard";
import { useEffect, useState } from "react";
import CreateNewDiscussionModal from "@/components/forum/CreateNewDiscussionModal";
import { usePosts } from "@/hooks/use-post";
import { formatDateToDMY, isApiSuccess } from "@/lib/utils";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import usePostService from "@/lib/services/post.service";
import { Comment } from "@/types/interfaces";
import { useAuth } from "@/contexts/auth-context";

export default function ForumsPage() {
  const router = useRouter();
  const { user } = useAuth();
  const { requireAuth, AuthGuard } = useAuthGuard();
  const [openCreateNewDiscussion, setOpenCreateNewDiscussion] = useState(false);
  const [selected, setSelected] = useState<number | string>();
  const [search, setSearch] = useState("");

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

  const {
    data: posts,
    isLoading: postLoading,
    refetch,
  } = usePosts({
    size: 10,
    query: { title: search },
  });
  const postItems = posts && isApiSuccess(posts) ? posts.data?.items ?? [] : [];

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
                <CardTitle>Discussion</CardTitle>
                <CardDescription>
                  Explore topics and join conversations
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <CommandDesktop
                  search={search}
                  setSearch={setSearch}
                  onSubmit={refetch}
                />
                {postItems.map((post) => (
                  <div
                    key={post.postId}
                    className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50 transition-colors cursor-pointer"
                    onClick={() => {
                      setSelected(post.postId);
                    }}
                  >
                    <div className="flex-1">
                      <p className="text-sm text-gray-600 mb-2">{post.title}</p>
                      <div className="flex items-center space-x-4 text-xs text-gray-500 mb-2">
                        {post.content}
                      </div>
                      <div className="flex items-center space-x-4 text-xs text-gray-500">
                        <span>{post.views} views</span>
                        <span>
                          Last activity: {formatDateToDMY(post.updatedAt)}
                        </span>
                      </div>
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
      {user && (
        <CreateNewDiscussionModal
          isOpen={openCreateNewDiscussion}
          onClose={() => setOpenCreateNewDiscussion(false)}
          user={user}
          onCreated={refetch}
        />
      )}
      {user && (
        <CommentDialog id={selected} setSelected={setSelected} user={user} />
      )}
    </div>
  );
}

const CommandDesktop = ({ search, setSearch, onSubmit }: any) => {
  const handleSubmit = () => {
    onSubmit();
  };
  return (
    <div className="flex items-center gap-2 mb-6">
      <div className="relative flex-1">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
        <Input
          placeholder="Search forums..."
          className="pl-10 bg-white border-gray-200"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>
      <Button
        type="submit"
        className="w-20 bg-gradient-to-r from-blue-600 to-purple-600"
        onClick={handleSubmit}
      >
        Search
      </Button>
    </div>
  );
};

const CommentDialog = ({ id, setSelected, user }: any) => {
  const { GET_POST_DETAIL, GET_POST_COMMENTS, GET_CHILD_CMTS, POST_COMMENT } =
    usePostService();
  const [data, setData] = useState<any>(null);
  const [isOpen, setisOpen] = useState(false);

  const [newComment, setNewComment] = useState("");

  const handleAddComment = async (e: any) => {
    const cmt: Comment = {
      postId: id,
      authorId: user?.userId,
      content: newComment,
      parentCommentId: null,
      type: "Comment",
    };
    const res = await POST_COMMENT(cmt);
    if (isApiSuccess(res)) {
      setNewComment("");
      fetch();
    }
  };

  useEffect(() => {
    setisOpen(!!id);
  }, [id]);

  useEffect(() => {
    fetch();
  }, [id]);

  const fetch = async () => {
    try {
      const res = await GET_POST_DETAIL(id);
      if (isApiSuccess(res) && res.data) {
        const cmt = await fetchPostCmts(res.data.postId);
        const userId = user.userId;
        const userComments = cmt.items.filter(
          (c: any) => c.authorId === userId
        );
        const otherComments = cmt.items.filter(
          (c: any) => c.authorId !== userId
        );
        const sortedComments = [...userComments, ...otherComments];
        setData({ ...res.data, comments: sortedComments });
      }
    } catch (error) {}
  };
  const fetchPostCmts = async (id: number | string) => {
    const cmt = await GET_POST_COMMENTS(id);
    if (isApiSuccess(cmt)) {
      return cmt.data;
    }
    return null;
  };

  return (
    <Dialog
      open={isOpen}
      onOpenChange={() => {
        setisOpen(false);
        setSelected(null);
      }}
    >
      <DialogContent className="max-w-2xl">
        <DialogTitle>{"Detail"}</DialogTitle>
        {data && (
          <div className="space-y-6">
            <div className="space-y-4">
              <div className="flex items-start gap-4">
                {/* <Avatar>
                      <AvatarImage src={selectedThread.author.avatar} />
                      <AvatarFallback>
                        {selectedThread.author.name[0]}
                      </AvatarFallback>
                    </Avatar> */}
                <div>
                  <h2 className="text-xl font-semibold">{data.title}</h2>
                  {/* <p className="text-sm text-gray-500">
                        Posted by {selectedThread.author.name} •{" "}
                        {formatDate(selectedThread.createdAt)}
                      </p> */}
                </div>
              </div>
              <p className="text-gray-700">{data.content}</p>
              <div className="flex items-center gap-6 pt-2 border-t">
                <Button variant="ghost" size="sm" className="gap-2">
                  <MessageSquare className="h-4 w-4 mr-1" />
                  Views ({data.views})
                </Button>
                <Button variant="ghost" size="sm" className="gap-2">
                  <Share2 className="h-4 w-4" />
                  Share
                </Button>
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="font-semibold">
                Comments ({data.comments.length})
              </h3>

              <div className="flex gap-4">
                <Avatar className="h-8 w-8">
                  <AvatarImage
                    src={"/placeholder.svg"}
                    alt={user.firstName || ""}
                  />
                  <AvatarFallback className="bg-gradient-to-r from-blue-500 to-purple-500 text-white">
                    {user.firstName?.charAt(0)}
                  </AvatarFallback>
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

              <div className="space-y-4 mt-6 overflow-y-auto max-h-96">
                {data.comments.map((comment: any) => (
                  <div key={comment.commentId} className="flex gap-4">
                    <Avatar className="h-8 w-8">
                      <AvatarImage
                        src={"/placeholder.svg"}
                        alt={comment.author?.firstName || ""}
                      />
                      <AvatarFallback className="bg-gradient-to-r from-blue-500 to-purple-500 text-white">
                        {comment.author?.firstName?.charAt(0)}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-medium">
                          {/* {comment.author.name} */}
                        </span>
                        <span className="text-sm text-gray-500">
                          {formatDateToDMY(comment.createdAt)}
                        </span>
                      </div>
                      <p className="text-gray-700 mt-1">{comment.content}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};
