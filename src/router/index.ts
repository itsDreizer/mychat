import { createBrowserRouter } from "react-router-dom";

import { publicRoutes, privateRoutes } from "./path";

export const router = createBrowserRouter(publicRoutes);
