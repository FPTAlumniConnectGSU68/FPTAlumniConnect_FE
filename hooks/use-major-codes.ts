import { APIClient } from "@/lib/api-client";
import { ACTIONS } from "@/lib/api-client/constants";
import { ApiResponse, PaginatedData } from "@/lib/apiResponse";
import { useQuery } from "@tanstack/react-query";

export interface Major {
  majorId: number;
  majorName: string;
  createdAt: string;
  updatedAt: string;
  createdBy: string;
  updatedBy: string;
}

export function useMajorCodes() {
  return useQuery<ApiResponse<PaginatedData<Major>>>({
    queryKey: ["majors"],
    queryFn: async () => {
      const response = await APIClient.invoke<
        ApiResponse<PaginatedData<Major>>
      >({
        action: ACTIONS.GET_MAJORS,
      });

      return response as ApiResponse<PaginatedData<Major>>;
    },
  });
}
