import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { login, fetchUsersLogin } from "../api/api";
import { TextField, Button, Box, Typography, Container, Alert } from "@mui/material";

export default function LoginPage() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [user, setUser] = useState<{ id: number; email: string } | null>(null);

  useEffect(() => {
    const checkAuth = async () => {
      const currentUser = await fetchUsersLogin();
      if (currentUser) {
        setUser(currentUser);
        navigate("/");
      }
    };
    checkAuth();
  }, []);

  const handleLogin = async () => {
    setError(null);
    setLoading(true);

    if (!email || !password) {
      setError("Введите email и пароль");
      setLoading(false);
      return;
    }

    try {
      const token = await login(email, password);
      if (!token) {
        throw new Error("Токен не получен");
      }

      localStorage.setItem("token", token);
      const currentUser = await fetchUsersLogin();
      setUser(currentUser);
      navigate("/");
    } catch (err) {
      setError("Неверный email или пароль");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container maxWidth="xs">
      <Box sx={{ mt: 10, textAlign: "center" }}>
        <Typography variant="h5" gutterBottom>
          Вход в систему
        </Typography>

        {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

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
        <Button 
          variant="contained" 
          fullWidth 
          sx={{ mt: 2 }} 
          onClick={handleLogin} 
          disabled={loading}
        >
          {loading ? "Вход..." : "Войти"}
        </Button>

        <Typography variant="body2" sx={{ mt: 2 }}>
          Нет аккаунта?{" "}
          <Button variant="text" onClick={() => navigate("/register")}>
            Зарегистрироваться
          </Button>
        </Typography>
      </Box>
    </Container>
  );
}
