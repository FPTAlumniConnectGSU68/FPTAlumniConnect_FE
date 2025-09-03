import { APIClient } from "@/lib/api-client";
import { ACTIONS } from "@/lib/api-client/constants";
import { ApiResponse, PaginatedData } from "@/lib/apiResponse";
import { RecruiterInfo } from "@/types/interfaces";
import { useQuery } from "@tanstack/react-query";

export function useRecuiter({ page = 1, size = 5, query = {} } = {}) {
  return useQuery<ApiResponse<PaginatedData<RecruiterInfo>>>({
    queryKey: ["recuiter", page, size, query],
    queryFn: async () => {
      const response = await APIClient.invoke<
        ApiResponse<PaginatedData<RecruiterInfo>>
      >({
        action: ACTIONS.GET_RECUITERS,
        query: {
          Page: page.toString(),
          Size: size.toString(),
          ...query,
        },
      });

      return response as ApiResponse<PaginatedData<RecruiterInfo>>;
    },
  });
}
