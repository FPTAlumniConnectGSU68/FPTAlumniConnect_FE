export interface LoginData {
  email: string;
  password: string;
}

export interface RegisterData {
  code: string;
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  roleId: number;
  majorId: number;
}

export interface UserInfo {
  userId: number;
  email: string;
  roleId: number;
  roleName: string;
  isMentor: boolean;
  googleId: string | null;
  firstName: string | null;
  lastName: string | null;
}

export interface SignInResponse {
  message: string;
  accessToken: string;
  userInfo: UserInfo;
}

export interface SignUpResponse {
  message: string;
  accessToken: string;
  userInfo: UserInfo;
}
