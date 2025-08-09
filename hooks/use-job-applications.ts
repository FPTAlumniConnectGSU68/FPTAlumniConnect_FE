import { APIClient } from "@/lib/api-client";
import { ACTIONS } from "@/lib/api-client/constants";
import { ApiResponse } from "@/lib/apiResponse";
import { JobApplicationCreate } from "@/types/interfaces";
import { useMutation } from "@tanstack/react-query";
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
