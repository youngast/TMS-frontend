import { useState, useEffect } from "react";
import {jwtDecode} from "jwt-decode";

interface DecodedToken {
  id: number;
  email: string;
  exp: number; // Время истечения токена
}

export const useAuth = () => {
  const [userId, setUserId] = useState<number | null>(null);

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (token) {
      try {
        const decoded: DecodedToken = jwtDecode(token);
        setUserId(decoded.id); // Достаем id из токена
      } catch (error) {
        console.error("Ошибка при декодировании токена:", error);
        setUserId(null);
      }
    }
  }, []);

  return { userId };
};
