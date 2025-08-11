import { APIClient } from "@/lib/api-client";
import { ACTIONS } from "@/lib/api-client/constants";
import { ApiResponse } from "@/lib/apiResponse";
import {
  JobApplicationByJobPostId,
  JobApplicationCreate,
} from "@/types/interfaces";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

export function useCreateJobApplication() {
  return useMutation<
    ApiResponse<JobApplicationCreate>,
    Error,
    JobApplicationCreate
  >({
    mutationFn: async (jobApplication: JobApplicationCreate) => {
      const response = await APIClient.invoke<
        ApiResponse<JobApplicationCreate>
      >({
        action: ACTIONS.CREATE_JOB_APPLICATION,
        data: jobApplication,
      });

      return response as ApiResponse<JobApplicationCreate>;
    },
    onSuccess: (response) => {
      if (response.status === "success") {
        toast.success("CV applied successfully");
      }
    },
  });
}

export function useGetJobApplicationsByJobPostId(jobPostId: number) {
  return useQuery<ApiResponse<JobApplicationByJobPostId>, Error>({
    queryKey: ["job-applications", jobPostId],
    enabled: Boolean(jobPostId),
    queryFn: async () => {
      const response = await APIClient.invoke<
        ApiResponse<JobApplicationByJobPostId>
      >({
        action: ACTIONS.GET_JOB_APPLICATIONS_BY_JOBPOST_ID,
        idQuery: jobPostId.toString(),
      });

      return response as ApiResponse<JobApplicationByJobPostId>;
    },
  });
}

export function useUpdateJobApplicationStatus(jobPostId?: number) {
  const queryClient = useQueryClient();
  return useMutation<
    ApiResponse<unknown>,
    Error,
    { applicationId: number; status: "Approved" | "Rejected" }
  >({
    mutationFn: async ({ applicationId, status }) => {
      const response = await APIClient.invoke<ApiResponse<unknown>>({
        action: ACTIONS.UPDATE_JOB_APPLICATION,
        idQuery: applicationId.toString(),
        data: { status },
      });
      return response as ApiResponse<unknown>;
    },
    onSuccess: (res) => {
      if (res.status === "success") {
        toast.success("Application updated");
        queryClient.invalidateQueries({
          queryKey: ["job-applications", jobPostId],
        });
      } else {
        toast.error("Failed to update application");
      }
    },
    onError: (err) => {
      toast.error(err.message || "Failed to update application");
    },
  });
}
