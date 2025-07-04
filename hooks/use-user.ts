import { APIClient } from "@/lib/api-client";
import { ACTIONS } from "@/lib/api-client/constants";
import { SuccessRes, User } from "@/types/interfaces";
import { useQuery } from "@tanstack/react-query";

interface UseUsersOptions {
  page?: number;
  size?: number;
  role?: string;
  major?: string;
}

export function useUsers({
  page = 1,
  size = 5,
  role,
  major,
}: UseUsersOptions = {}) {
  return useQuery<SuccessRes<User[]>>({
    queryKey: ["users", page, size, role, major],
    queryFn: async () => {
      const response = await APIClient.invoke<SuccessRes<User[]>>({
        action: ACTIONS.GET_USER,
        query: {
          Page: page.toString(),
          Size: size.toString(),
          RoleId: role?.toString() || "",
          MajorId: major?.toString() || "",
        },
      });

      return response as SuccessRes<User[]>;
    },
  });
}