export type LoginRequest = {
  email: string;
  password: string;
};

export type RegisterRequest = {
  email: string;
  password: string;
};
export type ApiResponse<T> = {
  data: T;
  code: number;
};
