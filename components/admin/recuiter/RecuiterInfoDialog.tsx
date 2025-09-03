import { useState } from "react";

import { RecruiterInfo } from "@/types/interfaces";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";

interface RecruiterDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  recruiter: RecruiterInfo | undefined;
  onSave: (
    recruiterInfoId: string,
    status: "Active" | "Inactive" | "Pending" | string
  ) => void;
}

export function RecruiterDialog({
  isOpen,
  onOpenChange,
  recruiter,
  onSave,
}: RecruiterDialogProps) {
  const [status, setStatus] = useState<string>(
    recruiter?.status?.toString() ?? "Pending"
  );

  if (!recruiter) return null;

  const handleClose = () => {
    onOpenChange(false);
    setStatus(recruiter?.status?.toString() ?? "Pending");
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Thông tin nhà tuyển dụng</DialogTitle>
          <DialogDescription>
            Xem và cập nhật thông tin nhà tuyển dụng.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <div>
            <label className="block text-sm font-medium mb-2">
              Company Name
            </label>
            <Input value={recruiter.companyName} disabled />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">
              Company Email
            </label>
            <Input value={recruiter.companyEmail} disabled />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">
              Company Phone
            </label>
            <Input value={recruiter.companyPhone} disabled />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Status</label>
            <Select
              value={status}
              onValueChange={(value: any) => setStatus(value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Active">Active</SelectItem>
                <SelectItem value="Inactive">Inactive</SelectItem>
                <SelectItem value="Pending">Pending</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <DialogFooter>
          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={handleClose}>
              Cancel
            </Button>
            <Button
              onClick={() => {
                onSave(recruiter.recruiterInfoId.toString(), status);
                handleClose();
              }}
            >
              Save
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
