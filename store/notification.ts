import { create } from "zustand";
import { Notification } from "@/types/interfaces";

interface NotificationStore {
  notifications: Notification[];
  unreadCount: number;
  addNotification: (notification: Notification) => void;
  setNotifications: (notifications: Notification[]) => void;
  markAsRead: (notificationId: number) => void;
  clearNotifications: () => void;
}

export const useNotificationStore = create<NotificationStore>((set) => ({
  notifications: [],
  unreadCount: 0,
  addNotification: (notification) =>
    set((state) => ({
      notifications: [notification, ...state.notifications],
      unreadCount: state.unreadCount + (notification.isRead ? 0 : 1),
    })),
  setNotifications: (notifications) =>
    set(() => ({
      notifications,
      unreadCount: notifications.filter((n) => !n.isRead).length,
    })),
  markAsRead: (notificationId) =>
    set((state) => ({
      notifications: state.notifications.map((n) =>
        n.id === notificationId ? { ...n, isRead: true } : n
      ),
      unreadCount: state.unreadCount - 1,
    })),
  clearNotifications: () => set({ notifications: [], unreadCount: 0 }),
}));
