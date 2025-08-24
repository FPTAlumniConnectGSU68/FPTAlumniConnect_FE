import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
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
  const isJoinedEvents = "UserId" in query && !!query.UserId;

  return useQuery<ApiResponse<PaginatedData<Event>>>({
    queryKey: [isJoinedEvents ? "user-events" : "events", page, size, query],
    queryFn: async () => {
      if (isJoinedEvents) {
        // Use joined events endpoint
        const response = await APIClient.invoke<
          ApiResponse<PaginatedData<Event>>
        >({
          action: ACTIONS.EVENT_JOINED,
          idQuery: query.UserId.toString(),
          query: {
            Page: page.toString(),
            Size: size.toString(),
            ...query,
          },
        });

        return response;
      }

      // Normal upcoming events endpoint
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
    enabled: !isJoinedEvents || !!query.UserId, // prevent running if joined events but no UserId
  });
}

interface UpdateEventData {
  eventId: string;
  eventData: Partial<Event>;
}

export function useUpdateEvent() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ eventId, eventData }: UpdateEventData) => {
      const response = await APIClient.invoke<ApiResponse<Event>>({
        action: ACTIONS.UPDATE_EVENT,
        idQuery: eventId,
        data: eventData,
      });
      return response;
    },
    onSuccess: () => {
      // Invalidate and refetch events
      queryClient.invalidateQueries({ queryKey: ["events"] });
    },
  });
}

export function useGetEventCount() {
  return useQuery<ApiResponse<number>>({
    queryKey: ["event-count"],
    queryFn: async () => {
      const response = await APIClient.invoke<ApiResponse<number>>({
        action: ACTIONS.GET_EVENT_COUNT,
      });
      return response;
    },
  });
}
