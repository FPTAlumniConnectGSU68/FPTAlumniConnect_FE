"use client";

import { useNotificationStore } from "@/store/notification";
import { NotificationService } from "@/lib/services/notification.service";
import { Notification } from "@/types/interfaces";
import { formatDistanceToNow } from "date-fns";
import { Check } from "lucide-react";
import { Button } from "@/components/ui/button";

interface NotificationItemProps {
  notification: Notification;
}

export function NotificationItem({ notification }: NotificationItemProps) {
  const { markAsRead } = useNotificationStore();

  const handleMarkAsRead = async () => {
    try {
      await NotificationService.markAsRead(notification.id);
      markAsRead(notification.id);
    } catch (error) {
      console.error("Failed to mark notification as read:", error);
    }
  };

  return (
    <div
      className={`flex items-start gap-4 p-4 hover:bg-gray-50 ${
        !notification.isRead ? "bg-blue-50" : ""
      }`}
    >
      <div className="flex-1 space-y-1">
        <p className="text-sm">{notification.message}</p>
        <p className="text-xs text-gray-500">
          {formatDistanceToNow(new Date(notification.timestamp), {
            addSuffix: true,
          })}
        </p>
      </div>
      {!notification.isRead && (
        <Button
          variant="ghost"
          size="icon"
          className="h-8 w-8"
          onClick={handleMarkAsRead}
        >
          <Check className="h-4 w-4" />
          <span className="sr-only">Mark as read</span>
        </Button>
      )}
    </div>
  );
}
