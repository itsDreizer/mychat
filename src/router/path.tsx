import Auth from "@/pages/auth/Auth";
import Messenger from "@/pages/messenger/Messenger";

import { Navigate, RouteObject } from "react-router-dom";

export const publicRoutes: RouteObject[] = [
  { path: "/auth", element: <Auth /> },
  { path: "/*", element: <Navigate to={"/auth"} /> },
];

export const privateRoutes: RouteObject[] = [
  { path: "/messenger", element: <Messenger /> },
  { path: "/*", element: <Navigate to={"/messenger"} /> },
];
