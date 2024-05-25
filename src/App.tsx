import { ThemeProvider, createTheme } from "@mui/material/styles";
import React, { useEffect } from "react";
import { RouterProvider, createBrowserRouter } from "react-router-dom";

import { StyledEngineProvider } from "@mui/material";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth } from "./API/firebase";
import { useAppSelector } from "./redux/hooks";
import "./App.scss";
import { privateRoutes, publicRoutes } from "./router/path";
import PageLoader from "./pages/pageLoader/PageLoader";

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
