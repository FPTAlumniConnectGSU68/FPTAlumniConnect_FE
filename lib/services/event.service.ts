import { APIClient } from "@/lib/api-client";
import { ACTIONS } from "@/lib/api-client/constants";
import { ApiResponse } from "@/lib/apiResponse";
import { Event } from "@/types/interfaces";

const useEventService = () => {
  const GET_EVENT_DETAIL = async (
    id: string | number
  ): Promise<ApiResponse<Event>> => {
    const res = await APIClient.invoke<ApiResponse<Event>>({
      action: ACTIONS.GET_EVENT_DETAIL,
      idQuery: id.toString(),
    });
    return res;
  };

  const JOIN_EVENT = async (eventId: string | number, userId: string | number) => {
    const res = await APIClient.invoke<ApiResponse<any>>({
      action: ACTIONS.JOIN_EVENT,
      data: {
        EventId: eventId,
        UserId: userId,
      },
    });
    return res;
  };

  // Other event-related functions if needed (CREATE_EVENT, UPDATE_EVENT, etc.)
  
  return {
    GET_EVENT_DETAIL,
    JOIN_EVENT,
  };
};

export default useEventService;
