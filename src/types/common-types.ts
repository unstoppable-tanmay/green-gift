export type ResponseType<T> = {
  message: string;
  status: "success" | "error";
  data: T;
  details?: string;
};

export type errorType = {
  message: string;
  details?: string;
};
