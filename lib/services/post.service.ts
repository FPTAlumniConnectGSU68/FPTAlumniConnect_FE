import { Comment, Post, TopUserApi } from "@/types/interfaces";
import { APIClient } from "../api-client";
import { ApiResponse } from "../apiResponse";
import { ACTIONS } from "../api-client/constants";

const usePostService = () => {
  const GET_POST_DETAIL = async (
    id: string | number
  ): Promise<ApiResponse<Post>> => {
    const res = await APIClient.invoke<ApiResponse<Post>>({
      action: ACTIONS.GET_FORUM_DETAIL,
      idQuery: id.toString(),
    });
    return res;
  };
  const GET_POST_COMMENTS = async (postId: string | number) => {
    const res = await APIClient.invoke<ApiResponse<any>>({
      action: ACTIONS.GET_FORUM_CMTS,
      query: {
        PostId: postId.toString(),
      },
    });
    return res;
  };

  const GET_CHILD_CMTS = async (cmtId: string | number) => {
    const res = await APIClient.invoke<ApiResponse<any>>({
      action: ACTIONS.GET_CHILD_CMTS,
      idQuery: cmtId.toString(),
    });
    return res;
  };

  const POST_COMMENT = async (data: Comment) => {
    const res = await APIClient.invoke<ApiResponse<Comment>>({
      action: ACTIONS.POST_CMT,
      data,
    });
    return res;
  };

  const NEW_POST = async (data: any) => {
    const res = await APIClient.invoke<ApiResponse<any>>({
      action: ACTIONS.CREATE_POST,
      data,
    });
    return res;
  };

  const GET_TOP_USERS = async () => {
    const res = await APIClient.invoke<ApiResponse<TopUserApi[]>>({
      action: ACTIONS.GET_TOP_USERS,
    });
    return res;
  };

  return {
    GET_POST_DETAIL,
    GET_POST_COMMENTS,
    GET_CHILD_CMTS,
    POST_COMMENT,
    NEW_POST,
    GET_TOP_USERS,
  };
};

export default usePostService;
