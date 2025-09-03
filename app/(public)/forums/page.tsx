"use client";

import AutocompleteDropdown from "@/components/autocomplete/AutocompleteSelect";
import CreateNewDiscussionModal from "@/components/forum/CreateNewDiscussionModal";
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
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { useAuth } from "@/contexts/auth-context";
import { useAuthGuard } from "@/hooks/use-auth-guard";
import { useMajorCodes } from "@/hooks/use-major-codes";
import { usePosts } from "@/hooks/use-post";
import usePostService from "@/lib/services/post.service";
import { formatDateToDMY, isApiSuccess } from "@/lib/utils";
import { CommentType, TopUser, TopUserApi } from "@/types/interfaces";
import { CirclePlus, MessageSquare, Search } from "lucide-react";
import { useSearchParams } from "next/navigation";
import { Suspense, use, useEffect, useState } from "react";

function ForumsContent() {
  const { user } = useAuth();
  const { GET_TOP_USERS } = usePostService();
  const searchParams = useSearchParams();
  const { requireAuth, AuthGuard } = useAuthGuard();
  const [openCreateNewDiscussion, setOpenCreateNewDiscussion] = useState(false);
  const [selected, setSelected] = useState<number | string>();
  const [search, setSearch] = useState("");
  const [major, setMajor] = useState<string>("Tất cả chuyên ngành");
  const [topUsers, setTopUsers] = useState<TopUser[]>([]);

  useEffect(() => {
    const openModal = searchParams.get("openModal") === "true";
    const id = searchParams.get("postId");

    if (openModal && id) {
      setSelected(id);
    } else if (openModal) {
      setOpenCreateNewDiscussion(true);
    }
  }, [searchParams]);

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
    query: {
      title: search,
      ...(major !== "Tất cả chuyên ngành" && { MajorId: major }),
    },
  });
  const postItems = posts && isApiSuccess(posts) ? posts.data?.items ?? [] : [];

  useEffect(() => {
    (async () => {
      const res = await GET_TOP_USERS();
      if (isApiSuccess(res) && res.data) {
        const formatted = res.data.map((user: TopUserApi) => ({
          name: user.userName,
          class: user.userCode, // directly map userCode to class
          posts: user.postCount,
          userAvatar: user.userAvatar,
        }));
        setTopUsers(formatted);
      }
    })();
  }, []);

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Hero Section */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Diễn đàn Alumni
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto mb-8">
            Kết nối, chia sẻ trải nghiệm và tham gia các cuộc thảo luận ý nghĩa
            <br />
            với các cựu sinh viên FPT.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Categories */}
            <Card>
              <CardHeader>
                <CardTitle>Thảo Luận</CardTitle>
                <CardDescription>
                  Khám phá các chủ đề và tham gia các cuộc trò chuyện
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <Suspense fallback={<div>Loading...</div>}>
                  <CommandDesktop
                    search={search}
                    setSearch={setSearch}
                    major={major}
                    setMajor={setMajor}
                    onSubmit={refetch}
                  />
                </Suspense>
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
                        <span>{post.views} Lượt xem</span>
                        <span>
                          Hoạt động lần cuối: {formatDateToDMY(post.updatedAt)}
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
              Bắt đầu thảo luận mới
            </Button>
            {/* Active Contributors */}
            <Card>
              <CardHeader>
                <CardTitle>Người cống hiến nhiều nhất</CardTitle>
                <CardDescription>
                  Người hoạt động nhiều nhất trong diễn đàn
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {topUsers.map((contributor, index) => (
                  <div key={index} className="flex items-center space-x-3">
                    <Avatar className="h-8 w-8">
                      <AvatarImage
                        src={
                          contributor.userAvatar ||
                          `/placeholder.svg?height=32&width=32`
                        }
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
                        Khóa {contributor.class}
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
                <CardTitle>Hướng Dẫn Diễn Đàn</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2 text-sm text-gray-600">
                <p>• Hãy tôn trọng mọi người</p>
                <p>• Giữ thảo luận đúng chủ đề</p>
                <p>• Không đăng spam hoặc quảng cáo cá nhân</p>
                <p>• Góp phần xây dựng một cộng đồng tích cực</p>
                <p>• Tránh tiết lộ thông tin cá nhân nhạy cảm</p>
                <p>
                  • Khuyến khích thảo luận mang tính xây dựng, đóng góp ý kiến
                </p>
                <p>• Chia sẻ thông tin chính xác, có nguồn gốc rõ ràng</p>

                {/* <Button variant="outline" size="sm" className="w-full mt-4">
                  Read Full Guidelines
                </Button> */}
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

export default function ForumsPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-gray-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="text-center">Loading forums...</div>
          </div>
        </div>
      }
    >
      <ForumsContent />
    </Suspense>
  );
}

const CommandDesktop = ({
  search,
  setSearch,
  major,
  setMajor,
  onSubmit,
}: any) => {
  const handleSubmit = () => {
    onSubmit();
  };
  const [majorSearch, setMajorSearch] = useState("");
  const { data: majorsRes } = useMajorCodes({
    searchString: majorSearch,
    query: { Size: "200" },
  });
  const majors =
    majorsRes?.status === "success" ? majorsRes.data?.items ?? [] : [];

  return (
    <div className="flex items-center gap-3 mb-6">
      <div className="relative flex-1">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
        <Input
          placeholder="Tìm kiếm..."
          className="pl-10 bg-white border-gray-200"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      <div className="w-48">
        <AutocompleteDropdown
          value={major}
          onChange={(val) => setMajor(val)}
          onSearch={setMajorSearch}
          options={[
            { value: "Tất cả chuyên ngành", label: "Tất cả chuyên ngành" },
            ...majors.map((m) => ({
              value: String(m.majorId),
              label: m.majorName,
            })),
          ]}
          placeholder="Select major..."
        />
      </div>

      <Button
        type="submit"
        className="w-24 bg-gradient-to-r from-blue-600 to-purple-600"
        onClick={handleSubmit}
      >
        Tìm kiếm
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

  const handleAddComment = async (
    e: any,
    content: string,
    parentCommentId?: number
  ) => {
    e.preventDefault();

    const cmt = {
      postId: id,
      authorId: user?.userId,
      content: content,
      parentCommentId: parentCommentId ?? null,
      type: parentCommentId ? "Trả lời" : "Comment",
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

  function CommentItem({
    comment,
    isLast = false,
  }: {
    comment: CommentType;
    isLast?: boolean;
  }) {
    const [showReplyInput, setShowReplyInput] = useState(false);
    const [replyText, setReplyText] = useState("");

    return (
      <div key={comment.commentId} className="flex flex-col gap-1">
        {/* Main comment */}
        <div className="flex gap-4">
          <Avatar className="h-8 w-8">
            <AvatarImage
              src={comment.authorAvatar}
              alt={comment.authorName || ""}
            />
            <AvatarFallback className="bg-gradient-to-r from-blue-500 to-purple-500 text-white">
              {comment.authorName.charAt(0)}
            </AvatarFallback>
          </Avatar>

          <div className="flex-1">
            <div className="flex items-center gap-2">
              <span className="font-medium">{comment.authorName}</span>
              <span className="text-sm text-gray-500">
                {formatDateToDMY(comment.createdAt)}
              </span>
            </div>
            <p className="text-gray-700 mt-1">{comment.content}</p>
            {comment.parentCommentId === null && (
              <button
                className="text-xs text-blue-600 mt-1 hover:underline"
                onClick={() => setShowReplyInput((prev) => !prev)}
              >
                Trả lời
              </button>
            )}

            {showReplyInput && (
              <div className="mt-2 flex gap-2">
                <Input
                  value={replyText}
                  onChange={(e) => setReplyText(e.target.value)}
                  placeholder="Viết trả lời..."
                />
                <Button
                  size="sm"
                  onClick={(e) => {
                    handleAddComment(e, replyText, comment.commentId);
                    setShowReplyInput(false);
                    setReplyText("");
                  }}
                  disabled={!replyText.trim()}
                >
                  Trả lời
                </Button>
              </div>
            )}
          </div>
        </div>

        {comment.childComments?.map((child, idx) => {
          const isLastChild = idx === comment.childComments!.length - 1;

          return (
            <div key={child.commentId} className="relative flex gap-4 ml-6">
              <div
                className={`absolute left-0 border-l border-gray-400 ${
                  isLastChild ? "top-0 h-4" : "top-0 bottom-0"
                }`}
              />
              <div className="absolute left-0 top-4 w-4 border-t border-gray-400" />
              <div className="flex-1 ml-6">
                <CommentItem comment={child} isLast={isLastChild} />
              </div>
            </div>
          );
        })}
      </div>
    );
  }

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
                <Avatar>
                  <AvatarImage src={data.authorAvatar} />
                  <AvatarFallback>{data.authorName}</AvatarFallback>
                </Avatar>
                <div>
                  <h2 className="text-xl font-semibold">{data.title}</h2>
                  <p className="text-sm text-gray-500">
                    Đăng bởi {data.authorName} •{" "}
                    {formatDateToDMY(data.createdAt)}
                  </p>
                </div>
              </div>
              <p className="text-gray-700">{data.content}</p>
              <div className="flex items-center gap-6 pt-2 border-t">
                <Button variant="ghost" size="sm" className="gap-2">
                  <MessageSquare className="h-4 w-4 mr-1" />
                  Lượt xem: ({data.views})
                </Button>
                {/* <Button variant="ghost" size="sm" className="gap-2">
                  <Share2 className="h-4 w-4" />
                  Share
                </Button> */}
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="font-semibold">
                Bình luận ({data.comments.length})
              </h3>

              <div className="flex gap-4">
                <Avatar className="h-8 w-8">
                  <AvatarImage
                    src={user.avatar || "/placeholder.svg"}
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
                    onClick={(e) => handleAddComment(e, newComment)}
                    disabled={!newComment.trim()}
                  >
                    Gửi
                  </Button>
                </div>
              </div>

              <div className="space-y-4 mt-6 overflow-y-auto max-h-96">
                {data.comments.map((comment: CommentType) => (
                  <CommentItem key={comment.commentId} comment={comment} />
                ))}
              </div>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};
