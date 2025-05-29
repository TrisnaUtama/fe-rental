import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

interface ConfirmDialogState {
  open: boolean;
  title?: string;
  description?: string;
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
      }>
    ) => {
      state.open = true;
      state.title = action.payload.title;
      state.description = action.payload.description;
    },
    closeDialog: (state) => {
      state.open = false;
      state.title = undefined;
      state.description = undefined;
    },
  },
});

export const { openDialog, closeDialog } = confirmDialogSlice.actions;
export default confirmDialogSlice.reducer;
