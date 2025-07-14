import { APIClient } from "@/lib/api-client";
import { ACTIONS } from "@/lib/api-client/constants";
import { ApiResponse, PaginatedData } from "@/lib/apiResponse";
import { Post } from "@/types/interfaces";
import { useQuery } from "@tanstack/react-query";

interface UsePostsOptions {
  page?: number;
  size?: number;
}

export function usePosts({ page = 1, size = 5 }: UsePostsOptions = {}) {
  return useQuery<ApiResponse<PaginatedData<Post>>>({
    queryKey: ["posts", page, size],
    queryFn: async () => {
      const response = await APIClient.invoke<ApiResponse<PaginatedData<Post>>>(
        {
          action: ACTIONS.GET_FORUMS,
          query: {
            Page: page.toString(),
            Size: size.toString(),
          },
        }
      );

      return response as ApiResponse<PaginatedData<Post>>;
    },
  });
}
