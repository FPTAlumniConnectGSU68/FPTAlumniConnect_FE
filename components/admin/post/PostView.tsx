import React, { useState } from "react";
import PostHeader from "./PostHeader";
import PostTable from "./PostTable";
import { usePosts } from "@/hooks/use-post";

const PostView = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const { data: posts, isLoading } = usePosts({ page: currentPage });

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };
  return (
    <div className="flex flex-col gap-4">
      <PostHeader />
      <PostTable
        posts={posts}
        isLoading={isLoading}
        currentPage={currentPage}
        onPageChange={handlePageChange}
      />
    </div>
  );
};

export default PostView;
