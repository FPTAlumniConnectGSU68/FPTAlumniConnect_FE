import { APIClient } from "@/lib/api-client";
import { ACTIONS } from "@/lib/api-client/constants";
import { Notification } from "@/types/interfaces";

export class NotificationService {
  static async getUserNotifications(userId: number): Promise<Notification[]> {
    console.log("userId in service", userId);
    const response = await APIClient.invoke<Notification[]>({
      action: ACTIONS.GET_USER_NOTIFICATIONS,
      idQuery: userId.toString(),
    });
    return response;
  }

  static async markAsRead(notificationId: number): Promise<boolean> {
    const response = await APIClient.invoke<boolean>({
      action: ACTIONS.MARK_NOTIFICATION_AS_READ,
      idQuery: notificationId.toString(),
    });
    return response;
  }
}
