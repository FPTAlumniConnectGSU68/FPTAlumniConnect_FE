"use client";

import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useAuth } from "@/contexts/auth-context";
import { NotificationService } from "@/lib/services/notification.service";
import { isApiSuccess } from "@/lib/utils";
import { useNotificationStore } from "@/store/notification";
import { Bell, BellRing } from "lucide-react";
import { useEffect, useState } from "react";
import { NotificationHeader } from "./notification-header";
import { NotificationItem } from "./notification-item";
import { useRef } from "react";
import { toast } from "sonner";

export function NotificationBell() {
  const [isOpen, setIsOpen] = useState(false);
  const { notifications, setNotifications, unreadCount } =
    useNotificationStore();
  const { user } = useAuth();
  const initializedRef = useRef(false);
  const seenIdsRef = useRef<Set<number>>(new Set());

  // Prefetch notifications when user becomes available (so unread badge shows immediately)
  useEffect(() => {
    if (!user?.userId) return;
    (async () => {
      try {
        const res = await NotificationService.getUserNotifications(user.userId);
        const notifications =
          res && isApiSuccess(res) && Array.isArray(res.data) ? res.data : [];
        setNotifications(notifications);
        // initialize seen ids without toasting
        seenIdsRef.current = new Set(notifications.map((n) => n.id as number));
        initializedRef.current = true;
      } catch (error) {
        console.error("Failed to prefetch notifications:", error);
      }
    })();
  }, [user?.userId, setNotifications]);

  // Lightweight polling fallback (no backend changes needed) to keep unread count fresh
  useEffect(() => {
    if (!user?.userId) return;
    let cancelled = false;
    const fetchLatest = async () => {
      try {
        const res = await NotificationService.getUserNotifications(user.userId);
        const notifications =
          res && isApiSuccess(res) && Array.isArray(res.data) ? res.data : [];
        if (!cancelled) {
          // toast for newly arrived notifications after initial load
          if (initializedRef.current) {
            const newOnes = notifications.filter(
              (n) => !seenIdsRef.current.has(n.id as number)
            );
            if (newOnes.length > 0) {
              newOnes.forEach((n) =>
                toast.info("You have a new notification", {
                  description: n.message,
                  duration: 5000,
                  icon: <BellRing className="h-5 w-5 text-blue-500" />,
                })
              );
            }
          }
          // update seen ids and store
          notifications.forEach((n) => seenIdsRef.current.add(n.id as number));
          setNotifications(notifications);
        }
      } catch (error) {
        // Silently ignore transient errors
      }
    };
    const intervalId: ReturnType<typeof setInterval> = setInterval(
      fetchLatest,
      5000
    );
    return () => {
      cancelled = true;
      clearInterval(intervalId);
    };
  }, [user?.userId, setNotifications]);

  // Fetch notifications when the popover opens
  useEffect(() => {
    if (isOpen) {
      const fetchNotifications = async () => {
        try {
          console.log("user?.userId in bell", user?.userId);
          const res = await NotificationService.getUserNotifications(
            user?.userId || 0
          );

          console.log("res in bell", res);
          const notifications =
            res && isApiSuccess(res) && Array.isArray(res.data) ? res.data : [];
          setNotifications(notifications);
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
