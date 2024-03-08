import React, { useEffect } from "react";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import { RouterProvider, createBrowserRouter } from "react-router-dom";

import "./App.scss";
import { publicRoutes, privateRoutes } from "./router/path";
import { useAppDispatch, useAppSelector } from "./redux/hooks";
import { auth } from "./API/firebase";
import { checkAuth, setIsAuth, setIsAuthLoading } from "./redux/reducers/AuthSlice";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { CircularProgress } from "@mui/material";
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
  const { isAuth, isAuthLoading } = useAppSelector((state) => {
    return state.authReducer;
  });

  const dispatch = useAppDispatch();

  useEffect(() => {
    const func = async () => {
      dispatch(setIsAuthLoading(true));
      const result: boolean = await new Promise((resolve, reject) => {
        return onAuthStateChanged(auth, (user) => {
          if (user) {
            dispatch(setIsAuth(true));
            dispatch(setIsAuthLoading(false));
          } else {
            dispatch(setIsAuth(false));
            dispatch(setIsAuthLoading(false));
          }
        });
      });
    };
    func();
  }, []);

  if (isAuthLoading) {
    return <PageLoader />;
  }

  const router = createBrowserRouter(isAuth ? privateRoutes : publicRoutes);

  return (
    <ThemeProvider theme={myTheme}>
      <RouterProvider router={router} />
    </ThemeProvider>
  );
};

export default App;
