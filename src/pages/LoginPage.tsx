import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { login, fetchCurrentUser } from "../api";
import { TextField, Button, Box, Typography, Container } from "@mui/material";

export default function LoginPage() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [user, setUser] = useState<{ id: number; email: string } | null>(null);

  useEffect(() => {
    const checkAuth = async () => {
      const currentUser = await fetchCurrentUser();
      if (currentUser) {
        setUser(currentUser);
        navigate("/"); // Если пользователь уже залогинен → переходим на главную
      }
    };
    checkAuth();
  }, []);

  const handleLogin = async () => {
    try {
      const token = await login(email, password);
      if (!token) {
        throw new Error("Токен не получен");
      }

      localStorage.setItem("token", token);
      const currentUser = await fetchCurrentUser();
      setUser(currentUser);
      navigate("/"); // После успешного входа переходим на главную
    } catch (err) {
      setError("Неверный email или пароль");
    }
  };

  return (
    <Container maxWidth="xs">
      <Box sx={{ mt: 10, textAlign: "center" }}>
        <Typography variant="h5" gutterBottom>
          Вход в систему
        </Typography>
        {error && <Typography color="error">{error}</Typography>}
        <TextField
          label="Email"
          fullWidth
          margin="normal"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <TextField
          label="Пароль"
          type="password"
          fullWidth
          margin="normal"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <Button variant="contained" fullWidth sx={{ mt: 2 }} onClick={handleLogin}>
          Войти
        </Button>
      </Box>
    </Container>
  );
}
