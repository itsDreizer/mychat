import React, { useEffect } from "react";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import { RouterProvider, createBrowserRouter } from "react-router-dom";

import "./App.scss";
import { publicRoutes, privateRoutes } from "./router/path";
import { useAppDispatch, useAppSelector } from "./redux/hooks";
import { auth } from "./API/firebase";
import { checkAuth, setIsAuth, setIsAuthLoading } from "./redux/reducers/AuthSlice";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { CircularProgress, StyledEngineProvider } from "@mui/material";
import PageLoader from "./pages/pageLoader/PageLoader";
import { useAuthState } from "react-firebase-hooks/auth";

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

  const [user, loading, error] = useAuthState(auth);

  useEffect(() => {
    if (error) {
      console.log(error);
    }
  }, [error]);

  if (loading || isAuthLoading) {
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
