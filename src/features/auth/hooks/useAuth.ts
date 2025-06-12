import { useAppDispatch, useAppSelector } from "@/shared/hooks/hooks";
import { useCallback } from "react";
import { logout } from "../authSlice";
import { signInAsync, signOutAsync, signUpAsync } from "../authThunk";
import type { ISignUpPayload } from "../types/auth.type";

export function useAuth() {
  const dispatch = useAppDispatch();
  const user = useAppSelector((state) => state.auth.user);
  const status = useAppSelector((state) => state.auth.status);
  const error = useAppSelector((state) => state.auth.error);

  const signIn = useCallback(
    async (email: string, password: string) => {
      return await dispatch(signInAsync({ email, password }));
    },
    [dispatch]
  );
  const signUp = useCallback(
    async (payload: ISignUpPayload) => {
      return await dispatch(signUpAsync({ payload }));
    },
    [dispatch]
  );
  const signOut = useCallback(
    async (user_id: string, token: string) => {
      return await dispatch(signOutAsync({ user_id, token }));
    },
    [dispatch]
  );

  const logoutFn = useCallback(() => dispatch(logout()), [dispatch]);

  return { user, status, error, signIn, signUp, signOut, logout: logoutFn };
}
