export interface IUser {
  id: string;
  name: string;
  email: string;
  phone_number: string;
  role: string;
  password: string;
  is_verified?: boolean;
  status: boolean;
  year_of_experiences: number;
}

export interface ICreateUser {
  password: string;
  name: string;
  email: string;
  phone_number: string;
  role: string;
  year_of_experiences: number;
}

export interface IUploadResult {
  status: 'success' | 'error' | 'skipped';
  email?: string;
  reason?: string;
  data?: IUser;
}

