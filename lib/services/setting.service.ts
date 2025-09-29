import { Setting } from "@/types/interfaces";
import { ApiResponse } from "../apiResponse";
import { APIClient } from "../api-client";
import { ACTIONS } from "../api-client/constants";

export const useSettingService = () => {
  const GET_SETTINGS = async (): Promise<ApiResponse<Setting>> => {
    const res = await APIClient.invoke<ApiResponse<Setting>>({
      action: ACTIONS.GET_SETTINGS,
    });
    return res;
  };

  const UPDATE_MENTORSHIP_CLEANUP = async (
    totalHours: number
  ): Promise<ApiResponse<any>> => {
    const res = await APIClient.invoke<ApiResponse<any>>({
      action: ACTIONS.UPDATE_MENTORSHIP_CLEANUP,
      data: { hours: totalHours },
    });
    return res;
  };
  const UPDATE_JOBPOST_CLEANUP = async (
    totalHours: number
  ): Promise<ApiResponse<any>> => {
    const res = await APIClient.invoke<ApiResponse<any>>({
      action: ACTIONS.UPDATE_JOBPOST_CLEANUP,
      data: { hours: totalHours },
    });
    return res;
  };

  const UPDATE_MENTORSHIP_SETTINGS = async (
    maxPerDay: number
  ): Promise<ApiResponse<any>> => {
    const res = await APIClient.invoke<ApiResponse<any>>({
      action: ACTIONS.UPDATE_MENTORSHIP_SETTINGS,
      query: { newValue: maxPerDay.toString() },
    });
    return res;
  };
  const UPDATE_SCHEDULE_SETTINGS = async (
    maxPerDay: number
  ): Promise<ApiResponse<any>> => {
    const res = await APIClient.invoke<ApiResponse<any>>({
      action: ACTIONS.UPDATE_SCHEDULE_SETTINGS,
      query: { newValue: maxPerDay.toString() },
    });
    return res;
  };

  return {
    GET_SETTINGS,
    UPDATE_MENTORSHIP_CLEANUP,
    UPDATE_JOBPOST_CLEANUP,
    UPDATE_MENTORSHIP_SETTINGS,
    UPDATE_SCHEDULE_SETTINGS,
  };
};
