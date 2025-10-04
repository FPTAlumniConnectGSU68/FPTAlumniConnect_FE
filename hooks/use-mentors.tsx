import { APIClient } from "@/lib/api-client";
import { ACTIONS } from "@/lib/api-client/constants";
import { ApiResponse, PaginatedData } from "@/lib/apiResponse";
import { Mentor } from "@/types/interfaces";
import { useQuery } from "@tanstack/react-query";

interface UseMentorsOptions {
  page?: number;
  size?: number;
  query?: Record<string, string>;
}

export function useMentors({
  page = 1,
  size = 50,
  query = {},
}: UseMentorsOptions = {}) {
  return useQuery<ApiResponse<PaginatedData<Mentor>>>({
    queryKey: ["mentors", page, size, query],
    queryFn: async () => {
      const response = await APIClient.invoke<
        ApiResponse<PaginatedData<Mentor>>
      >({
        action: ACTIONS.GET_MENTORS,
        query: {
          Page: page.toString(),
          Size: size.toString(),
          ...query,
        },
      });

      return response as ApiResponse<PaginatedData<Mentor>>;
    },
  });
}
