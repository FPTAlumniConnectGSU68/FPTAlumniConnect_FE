"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { JobPost, CV } from "@/types/interfaces";
import { useCV } from "@/hooks/use-cv";
import { isApiSuccess } from "@/lib/utils";
import { useAuth } from "@/contexts/auth-context";

interface JobApplicationDialogProps {
  isOpen: boolean;
  onClose: () => void;
  job: JobPost;
  onSubmit: (data: { coverLetter: string; cvid: number }) => void;
}

export function JobApplicationDialog({
  isOpen,
  onClose,
  job,
  onSubmit,
}: JobApplicationDialogProps) {
  const [coverLetter, setCoverLetter] = useState("");
  const [selectedCV, setSelectedCV] = useState<number>(0);
  const { user } = useAuth();
  const { data: cvData } = useCV({
    query: {
      UserId: user?.userId.toString() ?? "",
    },
  });

  const cvList = cvData && isApiSuccess(cvData) ? cvData.data?.items ?? [] : [];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({
      coverLetter,
      cvid: selectedCV,
    });
    setCoverLetter("");
    setSelectedCV(0);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold">
            Apply for "{job.jobTitle}"
          </DialogTitle>
          <DialogDescription>
            Please provide a cover letter and select your CV to apply for this
            position.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* CV Selection */}
          <div className="space-y-2">
            <Label htmlFor="cv" className="text-sm font-medium">
              Select your CV
            </Label>
            <Select
              value={selectedCV.toString()}
              onValueChange={(value) => setSelectedCV(parseInt(value))}
            >
              <SelectTrigger>
                <SelectValue placeholder="Choose a CV" />
              </SelectTrigger>
              <SelectContent>
                {cvList.map((cv: CV) => (
                  <SelectItem key={cv.id} value={cv.id.toString()}>
                    {cv.fullName} - {cv.desiredJob}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {cvList.length === 0 && (
              <p className="text-sm text-yellow-600">
                No CVs found. Please create a CV first.
              </p>
            )}
          </div>

          {/* Cover Letter */}
          <div className="space-y-2">
            <Label htmlFor="coverLetter" className="text-sm font-medium">
              Cover Letter
            </Label>
            <Textarea
              id="coverLetter"
              value={coverLetter}
              onChange={(e) => setCoverLetter(e.target.value)}
              placeholder="Write a brief cover letter explaining why you're a good fit for this position..."
              className="h-40 resize-none"
              required
            />
          </div>

          <div className="flex gap-3 justify-end">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button
              type="submit"
              className="bg-gradient-to-r from-blue-600 to-blue-800 hover:from-blue-700 hover:to-blue-900 text-white"
              disabled={!selectedCV || !coverLetter.trim()}
            >
              Submit Application
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
