import { APIClient } from "@/lib/api-client";
import { ACTIONS } from "@/lib/api-client/constants";
import { ApiResponse, PaginatedData } from "@/lib/apiResponse";
import { MentoringRequest } from "@/types/interfaces";
import { useQuery } from "@tanstack/react-query";

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
