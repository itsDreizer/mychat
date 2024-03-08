import { auth } from "@/API/firebase";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface IInitialState {
  isAuth: boolean;
  isAuthLoading: boolean;
}

const initialState: IInitialState = {
  isAuth: false,
  isAuthLoading: false,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    checkAuth(state, action: PayloadAction<void>) {
      state.isAuth = auth.currentUser ? true : false;
    },
    setIsAuth(state, action: PayloadAction<boolean>) {
      state.isAuth = action.payload;
    },
    setIsAuthLoading(state, action: PayloadAction<boolean>) {
      state.isAuthLoading = action.payload;
    },
  },
});

export const authReducer = authSlice.reducer;
export const { checkAuth, setIsAuth, setIsAuthLoading } = authSlice.actions;
