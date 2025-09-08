export type ApiListResponse<T> = {
  message: string;
  data: T[];
  page: number;
  limit: number;
  total: number;
  totalPage: number;
};

export type ApiResponse<T> = {
  message: string;
  data: T;
};
