import Auth from "@/pages/auth/Auth";
import Chat from "@/pages/chat/Chat";

import { Navigate, RouteObject } from "react-router-dom";

export const publicRoutes: RouteObject[] = [
  { path: "/auth", element: <Auth /> },
  { path: "/*", element: <Navigate to={"/auth"} /> },
];

export const privateRoutes: RouteObject[] = [
  { path: "/chat", element: <Chat /> },
  { path: "/*", element: <Navigate to={"/chat"} /> },
];
