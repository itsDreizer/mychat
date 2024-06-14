import { ThemeProvider, createTheme } from "@mui/material/styles";
import React, { useEffect } from "react";
import { RouterProvider, createBrowserRouter } from "react-router-dom";

import { StyledEngineProvider } from "@mui/material";
import { useAuthState } from "react-firebase-hooks/auth";
import { useCollectionData, useDocumentData } from "react-firebase-hooks/firestore";

import { auth, firestore } from "./API/firebase";
import { useAppDispatch, useAppSelector } from "./redux/hooks";
import "./App.scss";
import { privateRoutes, publicRoutes } from "./router/path";
import PageLoader from "./pages/pageLoader/PageLoader";
import { setWindowWidth } from "./redux/reducers/CommonStatesSlice";
import { IUserData } from "./API/types";
import { doc } from "firebase/firestore";

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

  const router = createBrowserRouter(user ? privateRoutes : publicRoutes);

  return (
    <ThemeProvider theme={myTheme}>
      <StyledEngineProvider injectFirst>
        <RouterProvider router={router} />
      </StyledEngineProvider>
    </ThemeProvider>
  );
};

export default App;
