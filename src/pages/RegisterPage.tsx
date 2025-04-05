import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { register, fetchUsersLogin } from "../api/api";
import { TextField, Button, Box, Typography, Container, Alert } from "@mui/material";

export default function RegisterPage() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    const checkAuth = async () => {
      const currentUser = await fetchUsersLogin();
      if (currentUser) {
        navigate("/login");
      }
    };
    checkAuth();
  }, []);

  const handleRegister = async () => {
    setError(null);
    setSuccess(false);
    setLoading(true);

    if (!email || !name || !password) {
      setError("Заполните все поля");
      setLoading(false);
      return;
    }

    try {
      const token = await register(email, name, password);
      if (!token) {
        throw new Error("Токен не получен");
      }

      localStorage.setItem("token", token);

      setSuccess(true);
      setTimeout(() => navigate("/login"), 2000); // Через 2 секунды перенаправляем на главную
    } catch (err) {
      setError("Ошибка регистрации. Возможно, email уже занят.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container maxWidth="xs">
      <Box sx={{ mt: 10, textAlign: "center" }}>
        <Typography variant="h5" gutterBottom>
          Регистрация
        </Typography>

        {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
        {success && <Alert severity="success" sx={{ mb: 2 }}>Регистрация успешна! Перенаправление...</Alert>}

        <TextField
          label="Email"
          fullWidth
          margin="normal"
          value={email}
          type="email"
          onChange={(e) => setEmail(e.target.value)}
        />
        <TextField
          label="Имя"
          fullWidth
          margin="normal"
          value={name}
          onChange={(e) => setName(e.target.value)}
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
          sx={{ mt: 2, bgcolor:'#BA3CCD' }} 
          onClick={handleRegister}
          disabled={loading}
        >
          {loading ? "Регистрация..." : "Зарегистрироваться"}
        </Button>

        <Typography variant="body2" sx={{ mt: 2 }}>
          Уже есть аккаунт? <Button variant="text" sx={{ color: "#BA3CCD" }} onClick={() => navigate("/login")}>Войти</Button>
        </Typography>
      </Box>
    </Container>
  );
}
