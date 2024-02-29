import Auth from "@/pages/auth/Auth";

import { RouteObject } from "react-router-dom";

export const publicRoutes: RouteObject[] = [{ path: "/auth", element: <Auth /> }];

export const privateRoutes: RouteObject[] = [];
