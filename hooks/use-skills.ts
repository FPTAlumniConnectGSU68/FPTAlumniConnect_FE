import { APIClient } from "@/lib/api-client";
import { ACTIONS } from "@/lib/api-client/constants";
import { ApiResponse, PaginatedData } from "@/lib/apiResponse";
import { Skill } from "@/types/interfaces";
import { useQuery } from "@tanstack/react-query";

interface UseSkillsOptions {
  page?: number;
  size?: number;
  query?: Record<string, string>;
}
export function useSkills({
  page = 1,
  size = 5,
  query = {},
}: UseSkillsOptions = {}) {
  return useQuery<ApiResponse<PaginatedData<Skill>>>({
    queryKey: ["skills", page, size, query],
    queryFn: async () => {
      const response = await APIClient.invoke<
        ApiResponse<PaginatedData<Skill>>
      >({
        action: ACTIONS.GET_SKILLS,
        query: {
          Page: page.toString(),
          Size: size.toString(),
          ...query,
        },
      });

      return response as ApiResponse<PaginatedData<Skill>>;
    },
  });
}
