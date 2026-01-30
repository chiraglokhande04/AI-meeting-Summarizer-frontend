import { createBrowserRouter } from "react-router";
import Home from "../main/Home";
import LoginScreen from "../main/auth/LoginScreen";
import ProtectedRoute from "./ProtectedRoute";
import MeetingDetails from "../main/components/MeetingDetails";
export const router = createBrowserRouter([
  {
    element: <ProtectedRoute />,
    children: [
      {
        path: "/",
        element: <Home />,
      },
      {
        path: "/meeting/:id",
        element: <MeetingDetails />,
      },
    ],
  },
  {
    path: "/login",
    element: <LoginScreen />,
  },
]);
