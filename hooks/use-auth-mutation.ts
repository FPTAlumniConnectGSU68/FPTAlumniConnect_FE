import { APIClient } from "@/lib/api-client";
import { ACTIONS } from "@/lib/api-client/constants";
import { useMutation } from "@tanstack/react-query";
import type {
  LoginData,
  RegisterData,
  SignInResponse,
  SignUpResponse,
} from "@/types/auth";

export function useAuthMutation() {
  const signIn = useMutation({
    mutationFn: async (params: LoginData) => {
      const response = (await APIClient.invoke({
        action: ACTIONS["SIGN_IN"],
        data: {
          email: params.email,
          password: params.password,
        },
      })) as SignInResponse;
      return response;
    },
  });

  const signUp = useMutation({
    mutationFn: async (params: RegisterData) => {
      const response = (await APIClient.invoke({
        action: ACTIONS["SIGN_UP"],
        data: {
          email: params.email,
          password: params.password,
          code: params.code,
          firstName: params.firstName,
          lastName: params.lastName,
          roleId: params.roleId,
          majorId: params.majorId,
        },
      })) as SignUpResponse;
      return response;
    },
  });

  return {
    signIn,
    signUp,
  };
}