import { APIClient } from "@/lib/api-client";
<<<<<<< HEAD
import { ACTIONS, API_URL } from "@/lib/api-client/constants";
import { ApiResponse } from "@/lib/apiResponse";
import { Event, EventWithSuggestions } from "@/types/interfaces";
import Cookies from "js-cookie";
=======
import { ACTIONS } from "@/lib/api-client/constants";
import { ApiResponse } from "@/lib/apiResponse";
import { Event } from "@/types/interfaces";
>>>>>>> a9ec0bae87494269df48cd121356889e5e42d8df

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

<<<<<<< HEAD
  const JOIN_EVENT = async (
    eventId: string | number,
    userId: string | number
  ) => {
=======
  const JOIN_EVENT = async (eventId: string | number, userId: string | number) => {
>>>>>>> a9ec0bae87494269df48cd121356889e5e42d8df
    const res = await APIClient.invoke<ApiResponse<any>>({
      action: ACTIONS.JOIN_EVENT,
      data: {
        EventId: eventId,
        UserId: userId,
      },
    });
    return res;
  };

<<<<<<< HEAD
  const CREATE_EVENT = async (
    eventData: Partial<Event>
  ): Promise<ApiResponse<Event>> => {
    return APIClient.invoke<ApiResponse<Event>>({
      action: ACTIONS.CREATE_EVENT,
      data: eventData,
    });
  };

  const CREATE_TIMELINES = async (
    eventId: number,
    timelines: {
      eventId: number;
      title: string;
      description?: string;
      startTime: string;
      endTime: string;
    }[]
  ) => {
    const access_token = Cookies.get("auth-token");

    const res = await fetch(`${API_URL}/v1/${eventId}/timelines`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...(access_token ? { Authorization: `Bearer ${access_token}` } : {}),
      },
      body: JSON.stringify(timelines),
    });

    if (!res.ok) {
      throw new Error(`Failed to create timelines: ${res.statusText}`);
    }

    return res.json(); // should be ApiResponse<unknown>
  };

  const PUT_RATING = async (
    userJoinEventId: string | number, // the ID for the query parameter
    ratingData: { eventId: number; rating: number; content?: string }
  ): Promise<ApiResponse<any>> => {
    return APIClient.invoke<ApiResponse<any>>({
      action: ACTIONS.PUT_RATING,
      idQuery: userJoinEventId.toString(),
      data: ratingData,
    });
  };

  // Other event-related functions if needed (CREATE_EVENT, UPDATE_EVENT, etc.)

  return {
    GET_EVENT_DETAIL,
    JOIN_EVENT,
    CREATE_EVENT,
    CREATE_TIMELINES,
    PUT_RATING,
=======
  // Other event-related functions if needed (CREATE_EVENT, UPDATE_EVENT, etc.)
  
  return {
    GET_EVENT_DETAIL,
    JOIN_EVENT,
>>>>>>> a9ec0bae87494269df48cd121356889e5e42d8df
  };
};

export default useEventService;
