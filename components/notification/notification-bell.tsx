"use client";

import { Bell } from "lucide-react";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useNotificationStore } from "@/store/notification";
import { NotificationService } from "@/lib/services/notification.service";
import { NotificationItem } from "./notification-item";
import { NotificationHeader } from "./notification-header";
import { useAuth } from "@/contexts/auth-context";

export function NotificationBell() {
  const [isOpen, setIsOpen] = useState(false);
  const { notifications, setNotifications, unreadCount } =
    useNotificationStore();
  const { user } = useAuth();
  console.log("user", user);

  // Fetch notifications when the popover opens
  useEffect(() => {
    if (isOpen) {
      const fetchNotifications = async () => {
        try {
          console.log("user?.userId in bell", user?.userId);
          const data = await NotificationService.getUserNotifications(
            user?.userId || 0
          );
          setNotifications(data);
        } catch (error) {
          console.error("Failed to fetch notifications:", error);
        }
      };
      fetchNotifications();
    }
  }, [isOpen, setNotifications]);

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="relative"
          aria-label="Open notifications"
        >
          <Bell className="h-5 w-5" />
          {unreadCount > 0 && (
            <span className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-[10px] font-medium text-white">
              {unreadCount}
            </span>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-80 p-0" align="end">
        <NotificationHeader />
        <ScrollArea className="h-[300px]">
          {notifications.length > 0 ? (
            notifications.map((notification) => (
              <NotificationItem
                key={notification.id}
                notification={notification}
              />
            ))
          ) : (
            <div className="flex h-full items-center justify-center p-4 text-sm text-gray-500">
              No notifications
            </div>
          )}
        </ScrollArea>
      </PopoverContent>
    </Popover>
  );
}
