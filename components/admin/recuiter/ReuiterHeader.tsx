import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import React, { useState } from "react";
import { useAuth } from "@/contexts/auth-context";

const RecuiterHeader = () => {
  const [open, setOpen] = useState(false);
  const { user } = useAuth();
  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Quản lý nhà tuyển dụng</h1>
      </div>
    </div>
  );
};

export default RecuiterHeader;
