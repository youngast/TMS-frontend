import React, { createContext, useState, useEffect, useContext, ReactNode } from 'react';

interface User {
  id: number;
  email: string;
  name: string;
  role: string;
}

interface AuthContextProps {
  user: User | null;
  loadingUser: boolean;
  setUser: React.Dispatch<React.SetStateAction<User | null>>;
}

const AuthContext = createContext<AuthContextProps | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loadingUser, setLoadingUser] = useState(true); // новое состояние для отслеживания загрузки

  useEffect(() => {
    async function fetchCurrentUser() {
      try {
        const token = localStorage.getItem('token');
        const response = await fetch('http://localhost:3000/auth/me', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        if (!response.ok) {
          throw new Error('Не удалось получить данные пользователя');
        }
        const currentUser: User = await response.json();
        setUser(currentUser);
      } catch (error) {
        console.error(error);
        setUser(null);
      } finally {
        setLoadingUser(false); // Загружены данные о пользователе
      }
    }

    fetchCurrentUser();
  }, []);

  return (
    <AuthContext.Provider value={{ user, loadingUser, setUser }}>
      {children}
    </AuthContext.Provider>
  );
};

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth должен использоваться внутри AuthProvider');
  }
  return context;
}