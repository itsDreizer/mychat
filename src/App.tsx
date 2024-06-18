import { ThemeProvider, createTheme } from "@mui/material/styles";
import React, { useEffect } from "react";
import { RouterProvider, createBrowserRouter } from "react-router-dom";

import { StyledEngineProvider } from "@mui/material";
import { useAuthState } from "react-firebase-hooks/auth";
import { useDocumentData } from "react-firebase-hooks/firestore";

import { doc } from "firebase/firestore";
import { auth, firestore } from "./API/firebase";
import { IUserData } from "./API/types";
import "./App.scss";
import PageLoader from "./pages/pageLoader/PageLoader";
import { useAppDispatch, useAppSelector } from "./redux/hooks";
import { setWindowWidth } from "./redux/reducers/CommonStatesSlice";
import { privateRoutes, publicRoutes } from "./router/path";

const myTheme = createTheme({
  palette: {
    mode: "dark",
  },

  typography: {
    fontFamily: "Montserrat",
  },
});

const App: React.FC = () => {
  const isAuthLoading = useAppSelector((state) => {
    return state.authReducer.isAuthLoading;
  });

  const dispatch = useAppDispatch();

  const [user, loading, error] = useAuthState(auth);
  const [userData, userDataLoading] = useDocumentData<IUserData>(user && doc(firestore, "users", user.uid));

  useEffect(() => {
    if (error) {
      console.log(error);
    }
  }, [error]);

  useEffect(() => {
    window.onresize = () => {
      dispatch(setWindowWidth(window.innerWidth));
    };
  }, []);

  if (loading || isAuthLoading || userDataLoading) {
    return <PageLoader />;
  }

  const router = createBrowserRouter(user && userData ? privateRoutes : publicRoutes);

  return (
    <ThemeProvider theme={myTheme}>
      <StyledEngineProvider injectFirst>
        <RouterProvider router={router} />
      </StyledEngineProvider>
    </ThemeProvider>
  );
};

export default App;
