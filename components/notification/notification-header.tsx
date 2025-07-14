"use client";

import { useNotificationStore } from "@/store/notification";

export function NotificationHeader() {
  const { notifications } = useNotificationStore();

  return (
    <div className="border-b px-4 py-3">
      <h4 className="text-sm font-medium">Notifications</h4>
      <p className="text-xs text-gray-500">
        You have {notifications.length} notification
        {notifications.length !== 1 ? "s" : ""}
      </p>
    </div>
  );
}
