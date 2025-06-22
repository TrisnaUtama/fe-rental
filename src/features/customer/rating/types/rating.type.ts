import type { IUser } from "@/features/auth/types/auth.type";

export type RatedEntityType =
  | "DESTINATION"
  | "VEHICLE"
  | "PACKAGE";

export interface IRating {
  id: string;
  userId: string;
  ratedType: RatedEntityType;
  targetId: string;
  ratingValue: number;
  status: boolean;
  comment: string;
  created_at: string;
  updated_at: string;
  deleted_at: string | null;
  user: IUser
}

export interface ICreateRatingPayload {
  ratedType: RatedEntityType;
  targetId: string;
  ratingValue: number;
  userId: string;
  comment: string;
}

export interface IUpdateRatingPayload {
  ratedType: RatedEntityType;
  targetId: string;
  ratingValue: number;
  userId: string;
  status: boolean;
}