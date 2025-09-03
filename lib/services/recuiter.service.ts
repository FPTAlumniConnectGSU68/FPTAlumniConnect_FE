import { RecruiterInfo } from "@/types/interfaces";
import { APIClient } from "../api-client";
import { ApiResponse } from "../apiResponse";
import { ACTIONS } from "../api-client/constants";

const useRecruiterService = () => {
  // Get recruiter detail by ID
  //   const GET_RECRUITER_DETAIL = async (
  //     id: string | number
  //   ): Promise<ApiResponse<RecruiterInfo>> => {
  //     const res = await APIClient.invoke<ApiResponse<RecruiterInfo>>({
  //       action: ACTIONS.GET_RECRUITER_DETAIL,
  //       idQuery: id.toString(),
  //     });
  //     return res;
  //   };

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

  return {
    // GET_RECRUITER_DETAIL,
    UPDATE_RECRUITER,
  };
};

export default useRecruiterService;
