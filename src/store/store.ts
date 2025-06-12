import { configureStore } from "@reduxjs/toolkit";
import authReducer from "@/features/auth/authSlice";
import confirmDialogReducer from "../store/slice/confiramtionDialog";

export const store = configureStore({
  reducer: {
    auth: authReducer,
    confirmDialog: confirmDialogReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
