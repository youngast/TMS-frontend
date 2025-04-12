import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { login, fetchUsersLogin } from "../api/api";
import { TextField, Button, Box, Typography, Container, Alert } from "@mui/material";
import { useAuth } from "../context/AuthContext";

export default function LoginPage() {
  const navigate = useNavigate();
  const { setUser } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    const checkAuth = async () => {
      const currentUser = await fetchUsersLogin();
      if (currentUser) {
        setUser(currentUser);
        navigate("/");
      }
    };
    checkAuth();
  }, [setUser, navigate]);

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
    <>
    <Container>
      <Box maxWidth="sm" sx={{backgroundColor: "#FFFFFF", borderRadius: "8px", boxShadow: 2, padding: "20px", marginTop: "50px", marginLeft: "auto", marginRight: "auto"}}>
        <Typography variant="h5" gutterBottom sx={{textAlign: "center", font: "Inter, sans-serif", fontWeight: 600}}>
          Вход в систему
        </Typography>

        {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

        <TextField
          label="Email"
          fullWidth
          margin="normal"
          value={email}
          type="email"
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
          sx={{ mt: 2, bgcolor:'#BA3CCD' }} 
          onClick={handleLogin} 
          disabled={loading}>
          {loading ? "Вход..." : "Войти"}
        </Button>

        <Typography variant="body2" sx={{ mt: 2 }}>
          Нет аккаунта?{" "}
          <Button variant="text" sx={{color:'#BA3CCD'}} onClick={() => navigate("/register")}>
            Зарегистрироваться
          </Button>
        </Typography>
      </Box>
    </Container>
    </>
  );
}