import { APIClient } from "@/lib/api-client";
import { ACTIONS } from "@/lib/api-client/constants";
import { ApiResponse, PaginatedData } from "@/lib/apiResponse";
import { JobPost } from "@/types/interfaces";
import { useQuery } from "@tanstack/react-query";

interface UseJobsOptions {
  page?: number;
  size?: number;
  query?: Record<string, string>;
}
export function useJobs({
  page = 1,
  size = 5,
  query = {},
}: UseJobsOptions = {}) {
  return useQuery<ApiResponse<PaginatedData<JobPost>>>({
    queryKey: ["jobs", page, size, query],
    queryFn: async () => {
      const response = await APIClient.invoke<
        ApiResponse<PaginatedData<JobPost>>
      >({
        action: ACTIONS.GET_JOBS,
        query: {
          Page: page.toString(),
          Size: size.toString(),
          ...query,
        },
      });

      return response as ApiResponse<PaginatedData<JobPost>>;
    },
  });
}

export function useGetJobPostCount() {
  return useQuery<ApiResponse<number>>({
    queryKey: ["job-post-count"],
    queryFn: async () => {
      const response = await APIClient.invoke<ApiResponse<number>>({
        action: ACTIONS.GET_JOB_POST_COUNT,
      });
      return response;
    },
  });
}
