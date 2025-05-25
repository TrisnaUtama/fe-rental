export interface IUser {
    user_id: string
    name:string
    email:string
    phone_number:string
    role:string
    is_verified:boolean
    status:string
    year_of_experiences:number
}

export interface ISignUpPayload {
  name: string;
  email: string;
  password: string;
  phone_number?: string;
}

export interface AuthContextType {
  user: IUser | null;
  login: (user: IUser) => void;
  isAuthenticated: boolean;
  logout: () => void;
}
