import { APIClient } from "@/lib/api-client";
import { ACTIONS } from "@/lib/api-client/constants";
import { ApiResponse } from "@/lib/apiResponse";
import type {
  LoginData,
  RegisterData,
  SignInResponse,
  SignUpResponse,
} from "@/types/auth";
import { useMutation } from "@tanstack/react-query";

export function useAuthMutation() {
  const signIn = useMutation({
    mutationFn: async (params: LoginData) => {
      const response = await APIClient.invoke<ApiResponse<SignInResponse>>({
        action: ACTIONS.SIGN_IN,
        data: {
          email: params.email,
          password: params.password,
        },
      });

      return response as ApiResponse<SignInResponse>;
    },
  });

  const signUp = useMutation({
    mutationFn: async (params: RegisterData) => {
      const response = await APIClient.invoke<ApiResponse<SignUpResponse>>({
        action: ACTIONS.SIGN_UP,
        data: {
          email: params.email,
          password: params.password,
          code: params.code,
          firstName: params.firstName,
          lastName: params.lastName,
          roleId: params.roleId,
          majorId: params.majorId,
        },
      });

      return response as ApiResponse<SignUpResponse>;
    },
  });

  return {
    signIn,
    signUp,
  };
}
