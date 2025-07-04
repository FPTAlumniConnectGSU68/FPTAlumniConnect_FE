import { APIClient } from "@/lib/api-client";
import { ACTIONS } from "@/lib/api-client/constants";
import { Event, SuccessRes } from "@/types/interfaces";
import { useQuery } from "@tanstack/react-query";

interface UseEventsOptions {
  page?: number;
  size?: number;
}

export function useEvents({ page = 1, size = 5 }: UseEventsOptions = {}) {
  return useQuery<SuccessRes<Event[]>>({
    queryKey: ["events", page, size],
    queryFn: async () => {
      const response = await APIClient.invoke<SuccessRes<Event[]>>({
        action: ACTIONS.GET_UPCOMMING_EVENTS,
        query: {
          Page: page.toString(),
          Size: size.toString(),
        },
      });

      return response as SuccessRes<Event[]>;
    },
  });
}