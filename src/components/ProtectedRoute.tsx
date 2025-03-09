import { JSX } from "@emotion/react/jsx-runtime";

export default function ProtectedRoute({ children }: { children: JSX.Element }) {
  const user = localStorage.getItem("token");

  if (!user) {
    window.location.href = "/login";
  }

  return <>{children}</>;
}