import { APIClient } from "@/lib/api-client";
import { ACTIONS } from "@/lib/api-client/constants";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { ApiResponse, PaginatedData } from "@/lib/apiResponse";
import { User } from "@/types/interfaces";
import { toast } from "sonner";

export const USER_QUERY_KEYS = {
  all: ["users"] as const,
  list: (filters?: Partial<UseUsersOptions>) =>
    [...USER_QUERY_KEYS.all, "list", filters] as const,
  detail: (id: string) => [...USER_QUERY_KEYS.all, "detail", id] as const,
} as const;

interface UseUsersOptions {
  page?: number;
  size?: number;
  role?: string;
  major?: string;
  query?: Record<string, string>;
}

export interface UserData {
  firstName: string;
  lastName: string;
  email: string;
  isMentor: boolean;
  profilePicture: string;
}

export interface UserMutationParams {
  userId: string;
  userData: UserData;
}

// Get users
export function useUsers({
  page = 1,
  size = 5,
  role,
  major,
  query = {},
}: UseUsersOptions = {}) {
  return useQuery<ApiResponse<PaginatedData<User>>>({
    queryKey: USER_QUERY_KEYS.list({ page, size, role, major }),
    queryFn: async () => {
      const response = await APIClient.invoke<ApiResponse<PaginatedData<User>>>(
        {
          action: ACTIONS.GET_USER,
          query: {
            Page: page.toString(),
            Size: size.toString(),
            RoleId: role?.toString() || "",
            MajorId: major?.toString() || "",
            ...query,
          },
        }
      );

      return response;
    },
  });
}

// Update user role
export function usePatchMentorUser() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ userId, userData }: UserMutationParams) => {
      const data: Record<string, unknown> = {
        firstName: userData.firstName,
        lastName: userData.lastName,
        email: userData.email,
        isMentor: userData.isMentor,
        profilePicture: userData.profilePicture,
      };

      const response = await APIClient.invoke<any>({
        action: ACTIONS.PATCH_MENTOR_USER,
        idQuery: userId,
        data,
      });

      return response;
    },
    onSuccess: () => {
      console.log("onSuccess");
      toast.success("User role updated successfully");
      queryClient.invalidateQueries({ queryKey: USER_QUERY_KEYS.all });
    },
    onError: (error) => {
      toast.error("Failed to update user role");
      console.error("Error updating user role:", error);
    },
  });
}

export function useGetUser(userId: number) {
  return useQuery<ApiResponse<User>>({
    queryKey: ["user", userId],
    queryFn: async () => {
      const response = await APIClient.invoke<ApiResponse<User>>({
        action: ACTIONS.GET_USER,
        idQuery: userId.toString(),
      });
      return response;
    },
  });
}

export interface UserCreateParams {
  code: string;
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  roleId: number;
  majorId: number;
}

export function useCreateUser() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({
      code,
      firstName,
      lastName,
      email,
      password,
      roleId,
      majorId,
    }: UserCreateParams) => {
      const response = await APIClient.invoke<ApiResponse<User>>({
        action: ACTIONS.SIGN_UP,
        data: { code, firstName, lastName, email, password, roleId, majorId },
      });
      return response;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: USER_QUERY_KEYS.all });
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });
}
