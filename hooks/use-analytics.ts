import { APIClient } from "@/lib/api-client";
import { ACTIONS } from "@/lib/api-client/constants";
import { ApiResponse } from "@/lib/apiResponse";
import { useQuery } from "@tanstack/react-query";

export type CountByMonthItem = {
  month: number;
  year: number;
  count: number;
};

export type CountByStatusItem = {
  status: string;
  count: number;
};

type MonthYear = {
  month?: number;
  year?: number;
};

function toQuery({ month, year }: MonthYear) {
  const query: Record<string, string> = {};
  if (typeof month === "number") query.Month = String(month);
  if (typeof year === "number") query.Year = String(year);
  return query;
}

// Totals
export function useGetJobApplicationCount() {
  return useQuery<ApiResponse<number>>({
    queryKey: ["job-application-count"],
    queryFn: async () => {
      const response = await APIClient.invoke<ApiResponse<number>>({
        action: ACTIONS.GET_JOB_APPLICATION_COUNT,
      });
      return response;
    },
  });
}

export function useGetMajorCount() {
  return useQuery<ApiResponse<number>>({
    queryKey: ["major-count"],
    queryFn: async () => {
      const response = await APIClient.invoke<ApiResponse<number>>({
        action: ACTIONS.GET_MAJOR_COUNT,
      });
      return response;
    },
  });
}

export function useGetMentorshipCount() {
  return useQuery<ApiResponse<number>>({
    queryKey: ["mentorship-count"],
    queryFn: async () => {
      const response = await APIClient.invoke<ApiResponse<number>>({
        action: ACTIONS.GET_MENTORSHIP_COUNT,
      });
      return response;
    },
  });
}

export function useGetPostCount() {
  return useQuery<ApiResponse<number>>({
    queryKey: ["post-count"],
    queryFn: async () => {
      const response = await APIClient.invoke<ApiResponse<number>>({
        action: ACTIONS.GET_POST_COUNT,
      });
      return response;
    },
  });
}

export function useGetScheduleCount() {
  return useQuery<ApiResponse<number>>({
    queryKey: ["schedule-count"],
    queryFn: async () => {
      const response = await APIClient.invoke<ApiResponse<number>>({
        action: ACTIONS.GET_SCHEDULE_COUNT,
      });
      return response;
    },
  });
}

// Monthly counts
export function useEventCountByMonth(params: MonthYear = {}) {
  const query = toQuery(params);
  return useQuery<ApiResponse<CountByMonthItem[]>>({
    queryKey: ["event-count-month", query],
    queryFn: async () => {
      const response = await APIClient.invoke<ApiResponse<CountByMonthItem[]>>({
        action: ACTIONS.GET_EVENT_COUNT_BY_MONTH,
        query,
      });
      return response;
    },
  });
}

export function useUserCountByMonth(params: MonthYear = {}) {
  const query = toQuery(params);
  return useQuery<ApiResponse<CountByMonthItem[]>>({
    queryKey: ["user-count-month", query],
    queryFn: async () => {
      const response = await APIClient.invoke<ApiResponse<CountByMonthItem[]>>({
        action: ACTIONS.GET_USER_COUNT_BY_MONTH,
        query,
      });
      return response;
    },
  });
}

export function useJobPostCountByMonth(params: MonthYear = {}) {
  const query = toQuery(params);
  return useQuery<ApiResponse<CountByMonthItem[]>>({
    queryKey: ["jobpost-count-month", query],
    queryFn: async () => {
      const response = await APIClient.invoke<ApiResponse<CountByMonthItem[]>>({
        action: ACTIONS.GET_JOB_POST_COUNT_BY_MONTH,
        query,
      });
      return response;
    },
  });
}

export function useMentorshipCountByMonth(params: MonthYear = {}) {
  const query = toQuery(params);
  return useQuery<ApiResponse<CountByMonthItem[]>>({
    queryKey: ["mentorship-count-month", query],
    queryFn: async () => {
      const response = await APIClient.invoke<ApiResponse<CountByMonthItem[]>>({
        action: ACTIONS.GET_MENTORSHIP_COUNT_BY_MONTH,
        query,
      });
      return response;
    },
  });
}

export function usePostCountByMonth(params: MonthYear = {}) {
  const query = toQuery(params);
  return useQuery<ApiResponse<CountByMonthItem[]>>({
    queryKey: ["post-count-month", query],
    queryFn: async () => {
      const response = await APIClient.invoke<ApiResponse<CountByMonthItem[]>>({
        action: ACTIONS.GET_POST_COUNT_BY_MONTH,
        query,
      });
      return response;
    },
  });
}

export function useScheduleCountByMonth(params: MonthYear = {}) {
  const query = toQuery(params);
  return useQuery<ApiResponse<CountByMonthItem[]>>({
    queryKey: ["schedule-count-month", query],
    queryFn: async () => {
      const response = await APIClient.invoke<ApiResponse<CountByMonthItem[]>>({
        action: ACTIONS.GET_SCHEDULE_COUNT_BY_MONTH,
        query,
      });
      return response;
    },
  });
}

// Status breakdown
export function useEventCountByStatus() {
  return useQuery<ApiResponse<CountByStatusItem[]>>({
    queryKey: ["event-count-status"],
    queryFn: async () => {
      const response = await APIClient.invoke<ApiResponse<CountByStatusItem[]>>(
        {
          action: ACTIONS.GET_EVENT_COUNT_BY_STATUS,
        }
      );
      return response;
    },
  });
}
