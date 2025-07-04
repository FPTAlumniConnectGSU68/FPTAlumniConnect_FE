import { APIClient } from "@/lib/api-client";
import { ACTIONS } from "@/lib/api-client/constants";
import { Post, SuccessRes } from "@/types/interfaces";
import { useQuery } from "@tanstack/react-query";

interface UsePostsOptions {
  page?: number;
  size?: number;
}

export function usePosts({ page = 1, size = 5 }: UsePostsOptions = {}) {
  return useQuery<SuccessRes<Post[]>>({
    queryKey: ["posts", page, size],
    queryFn: async () => {
      const response = await APIClient.invoke<SuccessRes<Post[]>>({
        action: ACTIONS.GET_FORUMS,
        query: {
          Page: page.toString(),
          Size: size.toString(),
        },
      });

      return response as SuccessRes<Post[]>;
    },
  });
}