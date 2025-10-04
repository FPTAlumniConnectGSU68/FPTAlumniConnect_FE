import { APIClient } from "@/lib/api-client";
import { ACTIONS } from "@/lib/api-client/constants";
import { ApiResponse, PaginatedData } from "@/lib/apiResponse";
import { Schedule, ScheduleCreate } from "@/types/interfaces";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

interface UseSchedulesOptions {
  page?: number;
  size?: number;
  query?: Record<string, string>;
}

const invalidateArr = [
  "schedules",
  "mentor-ship-requests",
  "mentorship-alumni-request",
];

export function useSchedules({
  page = 1,
  size = 5,
  query = {},
}: UseSchedulesOptions = {}) {
  return useQuery<ApiResponse<PaginatedData<Schedule>>>({
    queryKey: ["schedules", page, size, query],
    queryFn: async () => {
      const response = await APIClient.invoke<
        ApiResponse<PaginatedData<Schedule>>
      >({
        action: ACTIONS.GET_SCHEDULES,
        query: {
          Page: page.toString(),
          Size: size.toString(),
          ...query,
        },
      });

      return response as ApiResponse<PaginatedData<Schedule>>;
    },
  });
}

// interface UseMentorShipAlumniRequestOptions {
//   userId: number;
// }

// export function useMentorShipAlumniRequest({
//   userId,
// }: UseMentorShipAlumniRequestOptions) {
//   return useQuery<ApiResponse<MentoringRequest>>({
//     queryKey: ["mentorship-alumni-request", userId],
//     queryFn: async () => {
//       const response = await APIClient.invoke<ApiResponse<MentoringRequest>>({
//         action: ACTIONS.GET_MENTORSHIP_ALUMNI_REQUEST_BY_ID,
//         idQuery: userId.toString(),
//       });

//       return response as ApiResponse<MentoringRequest>;
//     },
//   });
// }

export function useCreateSchedule() {
  const queryClient = useQueryClient();
  return useMutation<ApiResponse<ScheduleCreate>, Error, ScheduleCreate>({
    mutationFn: async (data: ScheduleCreate) => {
      const response = await APIClient.invoke<ApiResponse<ScheduleCreate>>({
        action: ACTIONS.ACCEPT_SCHEDULE,
        data,
      });

      if (!response || response.status === "error") {
        throw new Error(response?.message || "Failed to create schedule");
      }

      return response;
    },
    onSuccess: (response) => {
      if (response.status === "success") {
        toast.success("Chấp nhận yêu cầu thành công");
        invalidateArr.forEach((key) => {
          queryClient.invalidateQueries({ queryKey: [key] });
        });
      }

      if (response.status !== "success") {
        throw new Error(
          response.message || "Failed to accept mentorship request"
        );
      }
    },
    onError: (error) => {
      toast.error(error.message || "Lỗi khi chấp nhận yêu cầu");
    },
  });
}

export function useCompleteSchedule() {
  const queryClient = useQueryClient();
  return useMutation<ApiResponse<Schedule>, Error, number>({
    mutationFn: async (scheduleId: number) => {
      const response = await APIClient.invoke<ApiResponse<Schedule>>({
        action: ACTIONS.COMPLETE_SCHEDULE,
        idQuery: scheduleId.toString(),
      });

      return response;
    },
    onSuccess: (response) => {
      if (response.status === "success") {
        toast.success("Hoàn thành buổi học thành công");
        invalidateArr.forEach((key) => {
          queryClient.invalidateQueries({ queryKey: [key] });
        });
      }
    },
    onError: (error) => {
      toast.error(error.message || "Lỗi khi hoàn thành buổi học");
    },
  });
}

export function useFailSchedule() {
  const queryClient = useQueryClient();
  return useMutation<
    ApiResponse<Schedule>,
    Error,
    { scheduleId: number; message: string }
  >({
    mutationFn: async ({ scheduleId, message }) => {
      const response = await APIClient.invoke<ApiResponse<Schedule>>({
        action: ACTIONS.FAIL_SCHEDULE,
        idQuery: scheduleId.toString(),
        data: { message },
      });

      return response;
    },
    onSuccess: (response) => {
      if (response.status === "success") {
        toast.success("Đã đánh dấu thất bại cho buổi học");
        invalidateArr.forEach((key) => {
          queryClient.invalidateQueries({ queryKey: [key] });
        });
      }
    },
    onError: (error) => {
      toast.error(error.message || "Lỗi khi đánh dấu thất bại buổi học");
    },
  });
}

export function useRateMentor() {
  const queryClient = useQueryClient();
  return useMutation<
    ApiResponse<Schedule>,
    Error,
    { scheduleId: number; rating: number; comment: string }
  >({
    mutationFn: async (data: {
      scheduleId: number;
      rating: number;
      comment: string;
    }) => {
      const response = await APIClient.invoke<ApiResponse<Schedule>>({
        action: ACTIONS.RATE_MENTOR_REQUEST,
        idQuery: data.scheduleId.toString(),
        data: {
          rate: data.rating,
          comment: data.comment,
        },
      });

      return response;
    },
    onSuccess: (response) => {
      if (response.status === "success") {
        toast.success("Cập nhật đánh giá buổi học thành công");
        invalidateArr.forEach((key) => {
          queryClient.invalidateQueries({ queryKey: [key] });
        });
      }
    },
    onError: (error) => {
      toast.error(error.message || "Lỗi khi cập nhật đánh giá buổi học");
    },
  });
}
