import { APIClient } from "@/lib/api-client";
import { ACTIONS } from "@/lib/api-client/constants";
import { SuccessRes } from "@/types/interfaces";
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
  return useQuery<SuccessRes<Major[]>>({
    queryKey: ["majors"],
    queryFn: async () => {
      const response = await APIClient.invoke<SuccessRes<Major[]>>({
        action: ACTIONS.GET_MAJORS,
      });

      return response as SuccessRes<Major[]>;
    },
  });
}