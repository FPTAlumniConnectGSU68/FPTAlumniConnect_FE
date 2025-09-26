import { APIClient } from "../api-client";
import { ACTIONS } from "../api-client/constants";
import { ApiResponse, PaginatedData } from "../apiResponse";
import { Skill } from "@/types/interfaces";

const useSkillService = () => {
  const GET_SKILLS = async (
    query?: Record<string, string>
  ): Promise<ApiResponse<PaginatedData<Skill>>> => {
    const res = await APIClient.invoke<ApiResponse<PaginatedData<Skill>>>({
      action: ACTIONS.GET_SKILLS,
      query: query || {},
    });
    return res;
  };

  const CREATE_SKILL = async (
    data: Partial<Skill>
  ): Promise<ApiResponse<any>> => {
    const res = await APIClient.invoke<ApiResponse<any>>({
      action: ACTIONS.CREATE_SKILL,
      data,
    });
    return res;
  };

  const UPDATE_SKILL = async (
    id: string | number,
    data: Partial<Skill>
  ): Promise<ApiResponse<any>> => {
    const res = await APIClient.invoke<ApiResponse<any>>({
      action: ACTIONS.UPDATE_SKILL,
      idQuery: id.toString(),
      data,
    });
    return res;
  };

  const DELETE_SKILL = async (
    id: string | number
  ): Promise<ApiResponse<any>> => {
    const res = await APIClient.invoke<ApiResponse<any>>({
      action: ACTIONS.DELETE_SKILL,
      idQuery: id.toString(),
    });
    return res;
  };

  return { GET_SKILLS, CREATE_SKILL, UPDATE_SKILL, DELETE_SKILL };
};

export default useSkillService;
