import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import {createBrowserRouter,RouterProvider,} from 'react-router-dom';
import LoginPage from './pages/LoginPage.tsx';
import ProtectedRoute from './components/ProtectedRoute.tsx';
import ProjectDetails from './pages/ProjectDetails.tsx';
import TestSuiteDetails from "./pages/TestSuiteDetails";

const router = createBrowserRouter([
  {
    path: "/login",
    element: <LoginPage />,
  },
  {
    path: "/",
    element: (
    <ProtectedRoute>
    <App />
    </ProtectedRoute>
  ),
  },
  {
    path: "/projects/:id",
    element: (
      <ProtectedRoute>
        <ProjectDetails />
      </ProtectedRoute>

    )
  },
  {
    path: "/test-suites/:id",
    element: (
    <ProtectedRoute>
      <TestSuiteDetails />
    </ProtectedRoute>
    )
  }
])


createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>,
)
