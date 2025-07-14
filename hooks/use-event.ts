import { useQuery } from "@tanstack/react-query";
import { APIClient } from "@/lib/api-client";
import { ACTIONS } from "@/lib/api-client/constants";
import { Event } from "@/types/interfaces";
import { ApiResponse, PaginatedData } from "@/lib/apiResponse";

interface UseEventsOptions {
  page?: number;
  size?: number;
  query?: Record<string, string>;
}

export function useEvents({
  page = 1,
  size = 5,
  query = {},
}: UseEventsOptions = {}) {
  return useQuery<ApiResponse<PaginatedData<Event>>>({
    queryKey: ["events", page, size, query],
    queryFn: async () => {
      const response = await APIClient.invoke<
        ApiResponse<PaginatedData<Event>>
      >({
        action: ACTIONS.GET_UPCOMMING_EVENTS,
        query: {
          Page: page.toString(),
          Size: size.toString(),
          ...query,
        },
      });

      return response;
    },
  });
}
