"use client";

import { JobPost, User } from "@/types/interfaces";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  MapPin,
  CircleDollarSign,
  Building2,
  GraduationCap,
  Loader2,
} from "lucide-react";
import { useRouteHistory } from "@/hooks/use-route-history";
import { useState } from "react";
import { JobApplicationDialog } from "./JobApplicationDialog";
import { toast } from "sonner";
import { useCreateJobApplication } from "@/hooks/use-job-applications";

interface JobDetailsProps {
  job: JobPost;
  user: User | null;
}

export function JobDetails({ job, user }: JobDetailsProps) {
  const { navigateToLogin } = useRouteHistory();
  const [isApplicationDialogOpen, setIsApplicationDialogOpen] = useState(false);
  const { mutateAsync: createJobApplication, isPending } =
    useCreateJobApplication();
  const handleApplyClick = () => {
    if (!user) {
      navigateToLogin();
      return;
    }
    setIsApplicationDialogOpen(true);
  };

  const handleApplicationSubmit = async (data: {
    coverLetter: string;
    cvid: number;
  }) => {
    try {
      const response = await createJobApplication({
        jobPostId: job.jobPostId,
        cvid: data.cvid,
        letterCover: data.coverLetter,
        status: "Pending",
      });
      if (response.status === "success") {
        setIsApplicationDialogOpen(false);
      } else {
        throw new Error("Failed to submit application. Please try again.");
      }
    } catch (error) {
      toast.error((error as Error).message);
    }
  };

  return (
    <>
      <Card className="sticky top-20">
        <CardContent className="p-6">
          <div className="flex justify-between items-start mb-6">
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">
                {job.jobTitle}
              </h2>
              <div className="space-y-2">
                <div className="flex items-center text-gray-600">
                  <Building2 className="h-4 w-4 mr-2" />
                  Company Email: {job.email}
                </div>
                <div className="flex items-center text-gray-600">
                  <MapPin className="h-4 w-4 mr-2" />
                  {job.location}
                </div>
                <div className="flex items-center text-gray-600">
                  <GraduationCap className="h-4 w-4 mr-2" />
                  {job.majorName}
                </div>
                <div className="flex items-center text-gray-600">
                  <CircleDollarSign className="h-4 w-4 mr-2" />
                  {`${job.minSalary.toLocaleString()} - ${job.maxSalary.toLocaleString()} VNĐ `}
                </div>
              </div>
            </div>
            <Badge variant="secondary" className="bg-green-100 text-green-800">
              {job.status}
            </Badge>
          </div>

          <div className="space-y-6">
            <section>
              <h3 className="text-lg font-semibold mb-2">Job Description</h3>
              <p className="text-gray-600 whitespace-pre-wrap">
                {job.jobDescription}
              </p>
            </section>

            <section>
              <h3 className="text-lg font-semibold mb-2">Requirements</h3>
              <p className="text-gray-600 whitespace-pre-wrap">
                {job.requirements}
              </p>
            </section>

            <section>
              <h3 className="text-lg font-semibold mb-2">Benefits</h3>
              <p className="text-gray-600 whitespace-pre-wrap">
                {job.benefits}
              </p>
            </section>

            <Button
              className="w-full bg-gradient-to-r from-blue-600 to-blue-800 hover:from-blue-700 hover:to-blue-900"
              onClick={handleApplyClick}
            >
              {isPending ? (
                <Loader2 className="animate-spin" />
              ) : user ? (
                "Apply Now"
              ) : (
                "Login to apply"
              )}
            </Button>
          </div>
        </CardContent>
      </Card>

      <JobApplicationDialog
        isOpen={isApplicationDialogOpen}
        onClose={() => setIsApplicationDialogOpen(false)}
        job={job}
        onSubmit={handleApplicationSubmit}
      />
    </>
  );
}

export function JobDetailsEmpty() {
  return (
    <Card>
      <CardContent className="p-6 text-center text-gray-500">
        Select a job to view details
      </CardContent>
    </Card>
  );
}
