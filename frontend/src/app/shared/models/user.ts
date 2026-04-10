export interface UserResponse {
  userId: number;
  name: string | null;
  email: string | null;
  createdAt: string | null;
}

export interface CreateUserRequest {
  name: string;
  email: string;
  password: string;
}

export interface UpdateUserRequest {
  name: string;
  email: string;
  password: string;
}
