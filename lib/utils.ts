import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { ApiResponse, ApiSuccess } from "./apiResponse";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function isApiSuccess<T>(res: ApiResponse<T>): res is ApiSuccess<T> {
  return res.status === "success";
}

export function formatDateToDMY(dateStr: string): string {
  const date = new Date(dateStr);
  const day = date.getDate().toString().padStart(2, "0");
  const month = (date.getMonth() + 1).toString().padStart(2, "0"); // Month is 0-based
  const year = date.getFullYear();

  return `${day}/${month}/${year}`;
}

export function formatTime(dateStr: string): string {
  if (!dateStr) return "";

  let date: Date;

  if (/^\d{2}:\d{2}(:\d{2})?$/.test(dateStr)) {
    // Case: only time provided ("HH:mm" or "HH:mm:ss")
    const today = new Date();
    const [hours, minutes, seconds] = dateStr.split(":").map(Number);
    today.setHours(hours, minutes, seconds || 0, 0);
    date = today;
  } else {
    // Case: full datetime
    date = new Date(dateStr);
  }

  let hours = date.getHours();
  const minutes = date.getMinutes().toString().padStart(2, "0");
  const ampm = hours >= 12 ? "PM" : "AM";

  hours = hours % 12 || 12; // convert to 12-hour format
  const hoursStr = hours.toString().padStart(2, "0");

  return `${hoursStr}:${minutes} ${ampm}`;
}

export function formatLocal(date: Date) {
  const pad = (n: number) => n.toString().padStart(2, "0");
  return (
    date.getFullYear() +
    "-" +
    pad(date.getMonth() + 1) +
    "-" +
    pad(date.getDate()) +
    "T" +
    pad(date.getHours()) +
    ":" +
    pad(date.getMinutes()) +
    ":" +
    pad(date.getSeconds())
  );
}
