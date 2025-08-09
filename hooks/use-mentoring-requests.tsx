import { APIClient } from "@/lib/api-client";
import { ACTIONS } from "@/lib/api-client/constants";
import { ApiResponse, PaginatedData } from "@/lib/apiResponse";
import { MentoringRequest, MentoringRequestCreate } from "@/types/interfaces";
import { useMutation, useQuery } from "@tanstack/react-query";
import { toast } from "sonner";

interface UseMentorShipRequestsOptions {
  page?: number;
  size?: number;
  query?: Record<string, string>;
}

export function useMentorShipRequests({
  page = 1,
  size = 5,
  query = {},
}: UseMentorShipRequestsOptions = {}) {
  return useQuery<ApiResponse<PaginatedData<MentoringRequest>>>({
    queryKey: ["mentor-ship-requests", page, size, query],
    queryFn: async () => {
      const response = await APIClient.invoke<
        ApiResponse<PaginatedData<MentoringRequest>>
      >({
        action: ACTIONS.GET_MENTORSHIP_REQUESTS,
        query: {
          Page: page.toString(),
          Size: size.toString(),
          ...query,
        },
      });

      return response as ApiResponse<PaginatedData<MentoringRequest>>;
    },
  });
}

interface UseMentorShipAlumniRequestOptions {
  userId: number;
}

export function useMentorShipAlumniRequest({
  userId,
}: UseMentorShipAlumniRequestOptions) {
  return useQuery<ApiResponse<MentoringRequest>>({
    queryKey: ["mentorship-alumni-request", userId],
    queryFn: async () => {
      const response = await APIClient.invoke<ApiResponse<MentoringRequest>>({
        action: ACTIONS.GET_MENTORSHIP_ALUMNI_REQUEST_BY_ID,
        idQuery: userId.toString(),
      });

      return response as ApiResponse<MentoringRequest>;
    },
  });
}

export function useCreateMentorShipRequest() {
  return useMutation<
    ApiResponse<MentoringRequest>,
    Error,
    MentoringRequestCreate
  >({
    mutationFn: async (data: MentoringRequestCreate) => {
      const response = await APIClient.invoke<ApiResponse<MentoringRequest>>({
        action: ACTIONS.CREATE_MENTORSHIP_REQUEST,
        data,
      });

      return response as ApiResponse<MentoringRequest>;
    },
    onSuccess: (response) => {
      if (response.status === "success") {
        toast.success("Mentorship request created successfully");
      }
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });
}
