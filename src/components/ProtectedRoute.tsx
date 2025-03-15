import { JSX } from "react";
import { jwtDecode } from "jwt-decode";

export default function ProtectedRoute({ children }: { children: JSX.Element }) {
  const token = localStorage.getItem("token");

  if (!token) {
    console.warn("❌ Токен отсутствует. Перенаправляем на страницу входа...");
    window.location.href = "/login";
    return null;
  }

  try {
    const decodedToken: { exp: number } = jwtDecode(token);
    const currentTime = Date.now() / 1000;

    if (decodedToken.exp < currentTime) {
      console.warn("Токен истек. Удаляем его и перенаправляем...");
      localStorage.removeItem("token"); 
      window.location.href = "/login";
      return null;
    }
  } catch (error) {
    console.error("Ошибка при декодировании токена:", error);
    localStorage.removeItem("token");
    window.location.href = "/login";
    return null;
  }

  return <>{children}</>;
}