export interface IUser {
  user_id: string;
  name: string;
  email: string;
  phone_number: string;
  role: string;
  is_verified: boolean;
  status: string;
  year_of_experiences: number;
}

export interface ISignUpPayload {
  name: string;
  email: string;
  password: string;
  phone_number?: string;
}

export interface IAuthResponse {
  success: boolean;
  message: string;
  data: IUser;
  access_token: string;
}

export interface User {
  name: string;
  email: string;
  role: string;
  id: string;
}

export interface AuthContextType {
  user: User | null | undefined;
  login: (user: User, token: string) => void;
  logout: () => void;
  updateAccessToken: (accessToken: string) => void;
  isAuthenticated: boolean;
  isLoading: boolean;
}

