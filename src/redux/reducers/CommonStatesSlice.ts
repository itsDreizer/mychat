import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface ICommonsState {
  windowWidth: number;
}

const initialState: ICommonsState = {
  windowWidth: window.innerWidth,
};

const CommonStatesSlice = createSlice({
  name: "common",
  initialState,
  reducers: {
    setWindowWidth(state, action: PayloadAction<number>) {
      state.windowWidth = action.payload;
    },
  },
});

export const commonStatesReducer = CommonStatesSlice.reducer;
export const { setWindowWidth } = CommonStatesSlice.actions;
