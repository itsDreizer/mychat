import { PayloadAction, createSlice } from "@reduxjs/toolkit";

interface ISnackbarState {
  isClipboardSnackbarVisible: boolean;
}

const initialState: ISnackbarState = {
  isClipboardSnackbarVisible: false,
};

const snackbarSlice = createSlice({
  name: "Snackbar",
  initialState,
  reducers: {
    setIsClipboardSnackbarVisible(state, action: PayloadAction<boolean>) {
      state.isClipboardSnackbarVisible = action.payload;
    },
  },
});

export const snackbarReducer = snackbarSlice.reducer;
export const { setIsClipboardSnackbarVisible } = snackbarSlice.actions;
