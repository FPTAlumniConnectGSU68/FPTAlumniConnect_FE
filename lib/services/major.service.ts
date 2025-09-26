import { APIClient } from "../api-client";
import { ACTIONS } from "../api-client/constants";
import { ApiResponse, PaginatedData } from "../apiResponse";

export interface MajorCodeItem {
  majorId: number;
  majorName: string;
  createdAt: string;
  updatedAt: string;
  createdBy: string;
  updatedBy: string;
}

const useMajorService = () => {
  const GET_MAJORS = async (
    query?: Record<string, string>
  ): Promise<ApiResponse<PaginatedData<MajorCodeItem>>> => {
    const res = await APIClient.invoke<
      ApiResponse<PaginatedData<MajorCodeItem>>
    >({
      action: ACTIONS.GET_MAJORS,
      query: query || {},
    });
    return res;
  };

  const CREATE_MAJOR = async (
    data: Partial<MajorCodeItem>
  ): Promise<ApiResponse<any>> => {
    const res = await APIClient.invoke<ApiResponse<any>>({
      action: ACTIONS.CREATE_MAJOR,
      data,
    });
    return res;
  };

  const UPDATE_MAJOR = async (
    id: string | number,
    data: Partial<MajorCodeItem>
  ): Promise<ApiResponse<any>> => {
    const res = await APIClient.invoke<ApiResponse<any>>({
      action: ACTIONS.UPDATE_MAJOR,
      idQuery: id.toString(),
      data,
    });
    return res;
  };

  const DELETE_MAJOR = async (
    id: string | number
  ): Promise<ApiResponse<any>> => {
    const res = await APIClient.invoke<ApiResponse<any>>({
      action: ACTIONS.DELETE_MAJOR,
      idQuery: id.toString(),
    });
    return res;
  };

  return { GET_MAJORS, CREATE_MAJOR, UPDATE_MAJOR, DELETE_MAJOR };
};

export default useMajorService;
