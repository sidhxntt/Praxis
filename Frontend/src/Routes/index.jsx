import { createBrowserRouter } from "react-router-dom";
import { ErrorBoundary } from "@/components/CommonLayouts/ErrorBoundary";
import { DashboardLayout } from "@/components/AdminDashboard/AdminDashboard_Layout/DashboardLayout";
import Dashboard from "@/components/AdminDashboard/Features/Dashboard";
import Apps from "@/components/AdminDashboard/Features/Apps";
import Users from "@/components/AdminDashboard/Features/Users";
import Tasks from "@/components/AdminDashboard/Features/Tasks";
import SettingsLayout from "@/components/AdminDashboard/AdminDashboard_Layout/SettingsLayout";
import SettingsProfile from "@/components/AdminDashboard/Features/Settings/Profile";
import SettingsAccount from "@/components/AdminDashboard/Features/Settings/Account";
import SettingsAppearance from "@/components/AdminDashboard/Features/Settings/Appearance";
import SettingsNotifications from "@/components/AdminDashboard/Features/Settings/Notifications";
import SettingsDisplay from "@/components/AdminDashboard/Features/Settings/Display";
import LoginPage from "./Login/index.jsx";
import SignupPage from "./Signup/index.jsx";
import LandingPageLayout from "@/components/LandingPage/LandingPageLayout/LandingPageLayout.jsx";
import Documentaton from "./Documentation/index.jsx";
import ComingSoon from "./ComingSoon/index.jsx";
import Home from "./Home/index.jsx";

const routes = createBrowserRouter([
  {
    path: "/",
    element: <LandingPageLayout />,
    errorElement: <ErrorBoundary />,
    children: [
      {
        path: "",
        element: <Home />,
      },
    ],
  },
  {
    path: "login",
    element: <LoginPage />,
  },
  {
    path: "signup",
    element: <SignupPage />,
  },
  {
    path: "/dashboard",
    element: <DashboardLayout />,
    errorElement: <ErrorBoundary />,
    children: [
      {
        path: "",
        element: <Dashboard />,
      },
      {
        path: "apps",
        element: <Apps />,
      },
      {
        path: "tasks",
        element: <Tasks />,
      },
      {
        path: "users",
        element: <Users />,
      },
      {
        path: "settings",
        element: <SettingsLayout />,
        children: [
          {
            path: "profile",
            element: <SettingsProfile />,
          },
          {
            path: "account",
            element: <SettingsAccount />,
          },
          {
            path: "appearance",
            element: <SettingsAppearance />,
          },
          {
            path: "notifications",
            element: <SettingsNotifications />,
          },
          {
            path: "display",
            element: <SettingsDisplay />,
          },
        ],
      },
      {
        path: "help-center",
        element: <ComingSoon />,
      },
    ],
  },
  {
    path: "documentation",
    element: <Documentaton />,
  },
]);

export default routes;
