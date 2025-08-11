import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import React, { useState } from "react";
import { JobPostCreateDialog } from "./JobPostCreateDialog";
import { useAuth } from "@/contexts/auth-context";
import { UserInfo } from "@/types/auth";

const JobPostHeader = () => {
  const [open, setOpen] = useState(false);
  const { user } = useAuth();
  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Job Post Management</h1>
        <Button variant="outline" onClick={() => setOpen(true)}>
          <Plus />
          Add Job Post
        </Button>
      </div>
      <JobPostCreateDialog
        open={open}
        onOpenChange={setOpen}
        user={user as UserInfo}
      />
    </div>
  );
};

export default JobPostHeader;
