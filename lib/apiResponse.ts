export type ApiSuccess<T = unknown> = {
  status: "success";
  message: string;
  data?: T;
};

export type ApiError = {
  status: "error";
  message: string;
  errors?: {
    field?: string;
    issue: string;
  }[];
};

export type ApiPartialSuccess<T = unknown> = {
  status: "partial_success";
  message: string;
  data?: T;
};

export type PaginatedData<T> = {
  size: number;
  page: number;
  total: number;
  totalPages: number;
  items: T[];
};

export type ApiResponse<T = unknown> =
  | ApiSuccess<T>
  | ApiPartialSuccess<T>
  | ApiError;
