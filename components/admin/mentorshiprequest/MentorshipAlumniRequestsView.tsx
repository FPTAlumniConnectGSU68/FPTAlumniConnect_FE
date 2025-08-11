"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { useAuth } from "@/contexts/auth-context";
import { useCreateMentorShipRequest } from "@/hooks/use-mentoring-requests";
import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";

const MentorshipAlumniRequestsView = () => {
  const [isOpen, setIsOpen] = useState(false);
  const searchParams = useSearchParams();
  const isCreate = searchParams.get("isCreate");
  const router = useRouter();
  const { user } = useAuth();
  const [requestMessage, setRequestMessage] = useState("");
  const { mutate: createMentorshipRequest, isPending } =
    useCreateMentorShipRequest();
  const handleOpenChange = (open: boolean) => {
    setIsOpen(open);
    if (!open && isCreate === "true") {
      // Remove the isCreate parameter from URL
      const url = new URL(window.location.href);
      url.searchParams.delete("isCreate");
      router.replace(url.pathname + url.search);
    }
  };

  const handleCreateMentorshipRequest = () => {
    createMentorshipRequest({
      aumniId: user?.userId ?? 0,
      requestMessage: requestMessage,
      type: null,
      status: "Pending",
    });
    setIsOpen(false);
    setRequestMessage("");
  };

  return (
    <div>
      {user?.roleName === "Alumni" && (
        <>
          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              setIsOpen(true);
            }}
          >
            Create Request
          </Button>
          <Dialog
            open={isOpen || isCreate === "true"}
            onOpenChange={handleOpenChange}
          >
            <DialogContent className="max-w-2xl bg-white max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>Create New Mentorship Request</DialogTitle>
              </DialogHeader>
              <DialogDescription className="space-y-4">
                <Input
                  type="text"
                  placeholder="Request Message"
                  className="w-full"
                  value={requestMessage}
                  onChange={(e) => setRequestMessage(e.target.value)}
                />
                <Button
                  type="submit"
                  className="w-full bg-gradient-to-r from-blue-600 to-purple-600"
                  disabled={isPending}
                  onClick={handleCreateMentorshipRequest}
                >
                  {isPending ? "Creating..." : "Create"}
                </Button>
              </DialogDescription>
              <DialogFooter>
                <DialogDescription className="text-sm text-gray-500 text-center">
                  This new request will be under review by the mentors.
                </DialogDescription>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </>
      )}
    </div>
  );
};

export default MentorshipAlumniRequestsView;
