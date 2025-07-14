import { APIClient } from "@/lib/api-client";
import { ACTIONS } from "@/lib/api-client/constants";
import { useMutation } from "@tanstack/react-query";
import type {
  LoginData,
  RegisterData,
  SignInResponse,
  SignUpResponse,
} from "@/types/auth";
import { ApiResponse } from "@/lib/apiResponse";

export function useAuthMutation() {
  const signIn = useMutation({
    mutationFn: async (params: LoginData) => {
      const response = await APIClient.invoke<
        ApiResponse<{ id: SignInResponse }>
      >({
        action: ACTIONS["SIGN_IN"],
        data: {
          email: params.email,
          password: params.password,
        },
      });

      return response;
    },
  });

  const signUp = useMutation<SignUpResponse, Error, RegisterData>({
    mutationFn: async ({
      email,
      password,
      code,
      firstName,
      lastName,
      roleId,
      majorId,
    }) => {
      return await APIClient.invoke<SignUpResponse>({
        action: ACTIONS.SIGN_UP,
        data: {
          email,
          password,
          code,
          firstName,
          lastName,
          roleId,
          majorId,
        },
      });
    },
  });

  return {
    signIn,
    signUp,
  };
}
