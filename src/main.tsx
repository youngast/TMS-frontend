import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.tsx";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import LoginPage from "./pages/LoginPage.tsx";
import ProtectedRoute from "./components/ProtectedRoute.tsx";
import ProjectDetails from "./pages/ProjectDetails.tsx";
import TestSuiteDetails from "./pages/TestSuiteDetails";
import Layout from "./components/Layout";
import RegisterPage from "./pages/RegisterPage.tsx";

const router = createBrowserRouter([
  {
    path: "/login",
    element: <LoginPage />,
  },
  {
    path: "/register",
    element: < RegisterPage/>,
  },
  {
    path: "/",
    element: (
      <ProtectedRoute>
        <Layout />
      </ProtectedRoute>
    ),
    children: [
      { path: "/", element: <App /> },
      { path: "projects/:id", element: <ProjectDetails /> },
      { path: "test-suites/:id", element: <TestSuiteDetails /> },
    ],
  },
]);

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>
);
