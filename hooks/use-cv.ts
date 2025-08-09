import { APIClient } from "@/lib/api-client";
import { ACTIONS } from "@/lib/api-client/constants";
import { ApiResponse, PaginatedData } from "@/lib/apiResponse";
import { CV, CVCreate } from "@/types/interfaces";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

interface UseCVOptions {
  page?: number;
  size?: number;
  query?: Record<string, string>;
}
export function useCV({ page = 1, size = 5, query = {} }: UseCVOptions = {}) {
  return useQuery<ApiResponse<PaginatedData<CV>>>({
    queryKey: ["cv", page, size, query],
    queryFn: async () => {
      const response = await APIClient.invoke<ApiResponse<PaginatedData<CV>>>({
        action: ACTIONS.GET_CV,
        query: {
          Page: page.toString(),
          Size: size.toString(),
          ...query,
        },
      });

      return response as ApiResponse<PaginatedData<CV>>;
    },
  });
}

// api not working
// export function useCVById(id: string) {
//   return useQuery<ApiResponse<CV>>({
//     queryKey: ["cv", id],
//     queryFn: async () => {
//       const response = await APIClient.invoke<ApiResponse<CV>>({
//         action: ACTIONS.GET_CV_BY_ID,
//         idQuery: id,
//       });

//       return response as ApiResponse<CV>;
//     },
//   });
// }

export function useCreateCV() {
  const queryClient = useQueryClient();
  return useMutation<ApiResponse<CVCreate>, Error, CVCreate>({
    mutationFn: async (cv: CVCreate) => {
      const response = await APIClient.invoke<ApiResponse<CVCreate>>({
        action: ACTIONS.CREATE_CV,
        data: cv,
      });

      return response as ApiResponse<CVCreate>;
    },
    onSuccess: (response) => {
      if (response.status === "success") {
        toast.success("CV created successfully");
        queryClient.invalidateQueries({ queryKey: ["cv"] });
      }
    },
  });
}

export function useUpdateCV() {
  const queryClient = useQueryClient();
  return useMutation<ApiResponse<CVCreate>, Error, CVCreate>({
    mutationFn: async (cv: CVCreate) => {
      const response = await APIClient.invoke<ApiResponse<CVCreate>>({
        action: ACTIONS.UPDATE_CV,
        idQuery: cv.userId.toString(),
        data: cv,
      });
      return response as ApiResponse<CVCreate>;
    },
    onSuccess: (response) => {
      if (response.status === "success") {
        toast.success("CV updated successfully");
        queryClient.invalidateQueries({ queryKey: ["cv"] });
      }
    },
  });
}
