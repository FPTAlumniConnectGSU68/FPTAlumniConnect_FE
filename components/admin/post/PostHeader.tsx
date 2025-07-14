import { Button } from "@/components/ui/button";
import React from "react";

const PostHeader = () => {
  return (
    <div className="flex justify-between items-center">
      <h1 className="text-2xl font-bold">Post Management</h1>
      <Button>Add Post</Button>
    </div>
  );
};

export default PostHeader;
