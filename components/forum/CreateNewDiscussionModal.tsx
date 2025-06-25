import React from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogHeader,
  DialogDescription,
  DialogFooter,
} from "../ui/dialog";
import { Textarea } from "../ui/textarea";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";

interface CreateNewDiscussionModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const CreateNewDiscussionModal = ({
  isOpen,
  onClose,
}: CreateNewDiscussionModalProps) => {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl bg-white max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Create New Discussion</DialogTitle>
        </DialogHeader>
        <DialogDescription className="space-y-4">
          <Input type="text" placeholder="Title" className="w-full" />
          <Textarea placeholder="Description" className="w-full" />
          <Select>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Select a topic" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="tech">Technology</SelectItem>
              <SelectItem value="career">Career</SelectItem>
              <SelectItem value="education">Education</SelectItem>
              <SelectItem value="events">Events</SelectItem>
            </SelectContent>
          </Select>
          <Button
            type="submit"
            className="w-full bg-gradient-to-r from-blue-600 to-purple-600"
          >
            Create
          </Button>
        </DialogDescription>
        <DialogFooter>
          <DialogDescription className="text-sm text-gray-500 text-center">
            This new discussion will be under review by the moderators.
          </DialogDescription>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default CreateNewDiscussionModal;
