import { Button } from "@/components/ui/button";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import Pagination from "@/components/ui/pagination";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { ApiResponse, PaginatedData } from "@/lib/apiResponse";
import { formatDateToDMY, formatTime, isApiSuccess } from "@/lib/utils";
import { Post } from "@/types/interfaces";
import React from "react";

interface PostTableProps {
  posts: ApiResponse<PaginatedData<Post>> | undefined;
  isLoading: boolean;
  currentPage: number;
  onPageChange: (page: number) => void;
}

const PostTable = ({
  posts,
  isLoading,
  currentPage,
  onPageChange,
}: PostTableProps) => {
  if (isLoading) {
    return <LoadingSpinner text="Loading..." />;
  }

  if (
    !posts ||
    !isApiSuccess(posts) ||
    !posts.data ||
    posts.data.items.length === 0
  ) {
    return <div className="text-center py-4">No posts found</div>;
  }

  const { items: postItems, totalPages, page } = posts.data;
  return (
    <div className="space-y-4">
      <div className="rounded-md border">
        <Table className="w-full bg-white">
          <TableHeader>
            <TableRow>
              <TableHead>Title</TableHead>
              <TableHead>Content</TableHead>
              <TableHead>Created At</TableHead>
              <TableHead>Updated At</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {postItems.map((post) => (
              <TableRow key={post.postId}>
                <TableCell>{post.title}</TableCell>
                <TableCell>{post.content}</TableCell>
                <TableCell>
                  {formatDateToDMY(post.createdAt) +
                    " " +
                    formatTime(post.createdAt)}
                </TableCell>
                <TableCell>
                  {formatDateToDMY(post.updatedAt) +
                    " " +
                    formatTime(post.updatedAt)}
                </TableCell>
                <TableCell>
                  <Sheet>
                    <SheetTrigger>Edit</SheetTrigger>
                    <SheetContent>
                      <SheetHeader>
                        <SheetTitle>Title</SheetTitle>
                        <SheetDescription>Description</SheetDescription>
                      </SheetHeader>
                      <div>Main content</div>
                      <SheetFooter>
                        <Button>Save</Button>
                      </SheetFooter>
                    </SheetContent>
                  </Sheet>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={onPageChange}
      />
    </div>
  );
};

export default PostTable;
