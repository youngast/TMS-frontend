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
import TestRunsPage from "./pages/TestRunPage.tsx";
import TestRunExecutionPage from "./pages/TestRunExecutionPage.tsx";
import { AuthProvider } from "./components/AuthContext.tsx";

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
      { path: "projects/:id/test-runs", element: <TestRunsPage /> },
      { path: "test-suites/:id", element: <TestSuiteDetails /> },
      { path: "projects/:projectId/test-runs/:testRunId/execute", element: <TestRunExecutionPage /> },
    ],
  },
]);

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <AuthProvider>
    <RouterProvider router={router} />
    </AuthProvider>
  </StrictMode>
);
