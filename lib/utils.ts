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
  const date = new Date(dateStr);
  const hours = date.getHours().toString().padStart(2, "0");
  const minutes = date.getMinutes().toString().padStart(2, "0");
  return `${hours}:${minutes}`;
}
