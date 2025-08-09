import { APIClient } from "@/lib/api-client";
import { ACTIONS } from "@/lib/api-client/constants";
import { Notification } from "@/types/interfaces";
import { ApiResponse } from "../apiResponse";

export class NotificationService {
  static async getUserNotifications(
    userId: number
  ): Promise<ApiResponse<Notification[]>> {
    console.log("userId in service", userId);
    const response = await APIClient.invoke<ApiResponse<Notification[]>>({
      action: ACTIONS.GET_USER_NOTIFICATIONS,
      idQuery: userId.toString(),
    });
    console.log("response in service", response);
    return response as ApiResponse<Notification[]>; // Align type with API shape
  }

  static async markAsRead(notificationId: number): Promise<boolean> {
    const response = await APIClient.invoke<boolean>({
      action: ACTIONS.MARK_NOTIFICATION_AS_READ,
      idQuery: notificationId.toString(),
    });
    return response;
  }
}
