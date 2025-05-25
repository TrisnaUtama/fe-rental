import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

interface ConfirmDialogState {
  open: boolean;
  title?: string;
  description?: string;
  onConfirm?: () => void;
}

const initialState: ConfirmDialogState = {
  open: false,
};

const confirmDialogSlice = createSlice({
  name: "confirmDialog",
  initialState,
  reducers: {
    openDialog: (
      state,
      action: PayloadAction<{
        title: string;
        description: string;
        onConfirm: () => void;
      }>
    ) => {
      state.open = true;
      state.title = action.payload.title;
      state.description = action.payload.description;
      state.onConfirm = action.payload.onConfirm;
    },
    closeDialog: (state) => {
      state.open = false;
      state.title = undefined;
      state.description = undefined;
      state.onConfirm = undefined;
    },
    confirm: (state) => {
      state.onConfirm?.();
      state.open = false;
    },
  },
});

export const { openDialog, closeDialog, confirm } = confirmDialogSlice.actions;
export default confirmDialogSlice.reducer;
