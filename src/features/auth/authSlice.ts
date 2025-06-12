import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { IAuthResponse, IUser } from "./types/auth.type";
import { signInAsync, signOutAsync, signUpAsync } from "./authThunk";

interface AuthState {
  user: IUser | null;
  status: "idle" | "loading" | "success" | "error";
  error: string | null;
}

const initialState: AuthState = {
  user: null,
  status: "idle",
  error: null,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    logout(state) {
      state.user = null;
      state.status = "idle";
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      //   Sign In
      .addCase(signInAsync.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(
        signInAsync.fulfilled,
        (state, action: PayloadAction<IAuthResponse>) => {
          state.status = "success";
          state.user = action.payload.data;
          state.error = null;
        }
      )
      .addCase(signInAsync.rejected, (state, action) => {
        state.status = "error";
        state.error = action.payload ?? "Sign In failed";
      })
      //   Sign Up
      .addCase(signUpAsync.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(signUpAsync.fulfilled, (state, action) => {
        state.status = "success";
        state.user = action.payload.data;
        state.error = null;
      })
      .addCase(signUpAsync.rejected, (state, action) => {
        state.status = "error";
        state.error = action.payload ?? "Sign up failed";
      })
      //   Sign out
      .addCase(signOutAsync.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(signOutAsync.fulfilled, (state) => {
        state.status = "success";
        state.user = null;
        state.error = null;
      })
      .addCase(signOutAsync.rejected, (state, action) => {
        state.status = "error";
        state.error = action.payload ?? "Sign Out failed";
      });
  },
});

export const { logout } = authSlice.actions;
export default authSlice.reducer;
