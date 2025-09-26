import { RecruiterInfo } from "@/types/interfaces";
import { APIClient } from "../api-client";
import { ApiResponse, PaginatedData } from "../apiResponse";
import { ACTIONS } from "../api-client/constants";

const useRecruiterService = () => {
  // Get recruiter detail by ID
  const GET_RECRUITER_INFO = async (
    id: string | number
  ): Promise<ApiResponse<PaginatedData<RecruiterInfo>>> => {
    const res = await APIClient.invoke<
      ApiResponse<PaginatedData<RecruiterInfo>>
    >({
      action: ACTIONS.GET_RECRUITER_INFO,
      query: { UserId: id.toString() },
    });
    return res;
  };

  // Update recruiter information
  const UPDATE_RECRUITER = async (
    id: string | number,
    status: string
  ): Promise<ApiResponse<any>> => {
    const res = await APIClient.invoke<ApiResponse<any>>({
      action: ACTIONS.UPDATE_RECRUITER,
      idQuery: id.toString(),
      data: status,
    });
    return res;
  };

  const CREATE_RECRUITER = async (
    data: Partial<RecruiterInfo>
  ): Promise<ApiResponse<any>> => {
    const res = await APIClient.invoke<ApiResponse<any>>({
      action: ACTIONS.CREATE_RECRUITER,
      data,
    });
    return res;
  };

  return {
    GET_RECRUITER_INFO,
    UPDATE_RECRUITER,
    CREATE_RECRUITER,
  };
};

export default useRecruiterService;
