import React, { useState } from "react";
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
import { useMajorCodes } from "@/hooks/use-major-codes";
import { isApiSuccess } from "@/lib/utils";
import usePostService from "@/lib/services/post.service";
import { useRouter } from "next/navigation";

interface CreateNewDiscussionModalProps {
  isOpen: boolean;
  onClose: () => void;
  user: any;
  onCreated: any;
}

const CreateNewDiscussionModal = ({
  isOpen,
  onClose,
  user,
  onCreated,
}: CreateNewDiscussionModalProps) => {
  const { data: majors } = useMajorCodes();
  const [selectedMajor, setSelectedMajor] = useState<string>(""); // ✅ Call this unconditionally
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const { NEW_POST } = usePostService();
  const router = useRouter();

  if (!majors || !isApiSuccess(majors) || !majors.data) return null;

  const majorItems = majors.data.items;
  const majorOptions = majorItems.map((major) => ({
    value: major.majorId.toString(),
    label: major.majorName,
  }));

  const handleSubmit = async () => {
    const newPost = {
      content: content,
      title: title,
      majorId: selectedMajor,
      authorId: user.userId,
      views: 0,
      isPrivate: true,
      status: "Published",
    };
    const res = await NEW_POST(newPost);
    if (isApiSuccess(res)) {
      onCreated();
      onClose();
    }
    if (res.status === "success")
      router.push(`/forums?openModal=true&postId=${res.data.id}`);
  };
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl bg-white max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Create New Discussion</DialogTitle>
        </DialogHeader>
        <DialogDescription className="space-y-4">
          <Input
            type="text"
            placeholder="Title"
            className="w-full"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
          <Textarea
            placeholder="Description"
            className="w-full"
            value={content}
            onChange={(e) => setContent(e.target.value)}
          />
          <Select value={selectedMajor} onValueChange={setSelectedMajor}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Select a major" />
            </SelectTrigger>
            <SelectContent>
              {majorOptions.map((item) => (
                <SelectItem key={item.value} value={item.value}>
                  {item.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Button
            type="submit"
            className="w-full bg-gradient-to-r from-blue-600 to-purple-600"
            onClick={handleSubmit}
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
