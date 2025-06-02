import { createAsyncThunk } from "@reduxjs/toolkit";
import { SignIn, SignOut, SignUp } from "./services/auth.service";
import type { IAuthResponse, ISignUpPayload, IUser } from "./types/auth.type";
import type { IResponseGlobal } from "@/shared/types/standard-response";

export const signInAsync = createAsyncThunk<IAuthResponse, { email: string; password: string }, { rejectValue: string }>(
  "auth/signIn",
  async ({ email, password }, { rejectWithValue }) => {
    try {
      const data = await SignIn(email, password);
      return data;
    } catch (error: any) {
      return rejectWithValue(error.message || "Login failed");
    }
  }
);

export const signUpAsync = createAsyncThunk<IResponseGlobal<IUser>, { payload:ISignUpPayload }, { rejectValue: string }>(
  "auth/signUp",
  async ({ payload }, { rejectWithValue }) => {
    try {
      const data = await SignUp(payload);
      return data;
    } catch (error: any) {
      return rejectWithValue(error.message || "Login failed");
    }
  }
);

export const signOutAsync = createAsyncThunk<IResponseGlobal<string>, { user_id: string, token: string }, { rejectValue: string }>(
  "auth/signOut",
  async ({ user_id, token }, { rejectWithValue }) => {
    try {
      const data = await SignOut(user_id, token);
      return data;
    } catch (error: any) {
      return rejectWithValue(error.message || "Login failed");
    }
  }
);
