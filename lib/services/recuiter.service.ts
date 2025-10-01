import { RecruiterInfo } from "@/types/interfaces";
import { APIClient } from "../api-client";
import { ApiResponse, PaginatedData } from "../apiResponse";
import { ACTIONS } from "../api-client/constants";

// Types
export type RecruiterStatus = "Active" | "Suspended" | "Pending";

export interface CreateRecruiterData {
  userId: number;
  status?: string;
  companyName: string;
  companyEmail: string;
  companyPhone: string;
  companyLogoUrl: string;
  companyCertificateUrl: string;
}

export interface UpdateRecruiterInfoData {
  userId: number;
  status: string;
  companyName: string;
  companyEmail: string;
  companyPhone: string;
  companyLogoUrl: string;
  companyCertificateUrl: string;
}

export interface RecruiterService {
  GET_RECRUITER_INFO: (
    id: string | number
  ) => Promise<ApiResponse<PaginatedData<RecruiterInfo>>>;
  UPDATE_RECRUITER_STATUS: (
    id: string | number,
    status: string
  ) => Promise<ApiResponse<any>>;
  UPDATE_RECRUITER: (
    id: string | number,
    data: Partial<RecruiterInfo>
  ) => Promise<ApiResponse<any>>;
  CREATE_RECRUITER: (data: CreateRecruiterData) => Promise<ApiResponse<any>>;
  UPDATE_RECRUITER_INFO: (
    data: UpdateRecruiterInfoData
  ) => Promise<ApiResponse<any>>;
}

/**
 * Custom hook that provides recruiter-related API operations
 * @returns RecruiterService object with all recruiter operations
 */
const useRecruiterService = (): RecruiterService => {
  /**
   * Fetches recruiter information by user ID
   * @param id - User ID (string or number)
   * @returns Promise with paginated recruiter info
   */
  const GET_RECRUITER_INFO = async (
    id: string | number
  ): Promise<ApiResponse<PaginatedData<RecruiterInfo>>> => {
    try {
      const response = await APIClient.invoke<
        ApiResponse<PaginatedData<RecruiterInfo>>
      >({
        action: ACTIONS.GET_RECRUITER_INFO,
        query: { UserId: id.toString() },
      });
      return response;
    } catch (error) {
      throw new Error(`Failed to fetch recruiter info: ${error}`);
    }
  };

  /**
   * Updates recruiter status (admin only operation)
   * @param id - Recruiter info ID
   * @param status - New status value
   * @returns Promise with API response
   */
  const UPDATE_RECRUITER_STATUS = async (
    id: string | number,
    status: string
  ): Promise<ApiResponse<any>> => {
    try {
      const response = await APIClient.invoke<ApiResponse<any>>({
        action: ACTIONS.UPDATE_RECRUITER_STATUS,
        idQuery: id.toString(),
        data: status,
      });
      return response;
    } catch (error) {
      throw new Error(`Failed to update recruiter status: ${error}`);
    }
  };

  /**
   * Updates recruiter information (admin function)
   * @param id - Recruiter info ID
   * @param data - Partial recruiter data to update
   * @returns Promise with API response
   */
  const UPDATE_RECRUITER = async (
    id: string | number,
    data: Partial<RecruiterInfo>
  ): Promise<ApiResponse<any>> => {
    try {
      const response = await APIClient.invoke<ApiResponse<any>>({
        action: ACTIONS.UPDATE_RECRUITER,
        idQuery: id.toString(),
        data,
      });
      return response;
    } catch (error) {
      throw new Error(`Failed to update recruiter: ${error}`);
    }
  };

  /**
   * Creates a new recruiter profile
   * @param data - Recruiter creation data
   * @returns Promise with API response
   */
  const CREATE_RECRUITER = async (
    data: CreateRecruiterData
  ): Promise<ApiResponse<any>> => {
    try {
      const response = await APIClient.invoke<ApiResponse<any>>({
        action: ACTIONS.CREATE_RECRUITER,
        data,
      });
      return response;
    } catch (error) {
      throw new Error(`Failed to create recruiter: ${error}`);
    }
  };

  /**
   * Updates recruiter information (for recruiters updating their own info)
   * @param data - Complete recruiter info data
   * @returns Promise with API response
   */
  const UPDATE_RECRUITER_INFO = async (
    data: UpdateRecruiterInfoData
  ): Promise<ApiResponse<any>> => {
    try {
      const response = await APIClient.invoke<ApiResponse<any>>({
        action: ACTIONS.UPDATE_RECRUITER_INFO,
        data,
      });
      return response;
    } catch (error) {
      throw new Error(`Failed to update recruiter info: ${error}`);
    }
  };

  return {
    GET_RECRUITER_INFO,
    UPDATE_RECRUITER_STATUS,
    UPDATE_RECRUITER,
    UPDATE_RECRUITER_INFO,
    CREATE_RECRUITER,
  };
};

export default useRecruiterService;
