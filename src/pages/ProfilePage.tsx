import React, { useEffect, useState } from 'react';
import { fetchCurrentUser, UpdateUser } from '../api/api';
import { uploadAvatar } from '../api/Userapi';
import {
  Card,
  CardContent,
  Typography,
  CircularProgress,
  Box,
  Avatar,
  Button,
  Container,
  Grid,
  TextField,
  IconButton
} from '@mui/material';
import { PhotoCamera } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';

interface User {
  id: number;
  name: string;
  email: string;
  avatarUrl?:string;
}

const ProfilePage = () => {
  const [userData, setUserData] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [formData, setFormData] = useState<User>({id: 0, name: '', email: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [avatarFile, setAvatarFile] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    const getUserData = async () => {
      const data = await fetchCurrentUser();
      if (data) {
        setUserData(data);
        setFormData(data);
      }
      setLoading(false);
    };

    getUserData();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prevState => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleEditToggle = () => {
    setEditing(!editing);
  };

  const handleSaveChanges = async () => {
    setIsSubmitting(true);
    try {
        const updatedUser = await UpdateUser( userData!.id,formData); 
      setUserData(updatedUser);
      setEditing(false);
    } catch (error) {
      console.error("Ошибка обновления данных пользователя:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleAvatarUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    if(event.target.files){
      setAvatarFile(true);
      const file = event.target.files[0];
      try{
        const response = await uploadAvatar(userData!.id, file);
        setUserData((prevState) => ({
          ...prevState!,
          avatarUrl: response.avatarUrl,
        }));
      }catch(error){
        console.error("Error uploading avatar:", error);
      }finally{ setAvatarFile(false);

      }
    }
  }

  console.log("userData:", userData);

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" height="100vh">
        <CircularProgress />
      </Box>
    );
  }

  if (!userData) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" height="100vh">
        <Typography variant="h6" color="error">Не удалось получить данные пользователя</Typography>
      </Box>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ mt: 4 }}>
                <IconButton onClick={() => navigate("/")} sx={{ mr: 1 }}>
          <ArrowBackIcon />
        </IconButton>
      <Grid container spacing={4}>
        {/* Левая часть - Информация о пользователе */}
        <Grid item xs={12} md={4}>
          <Card sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', p: 3 }}>
            <IconButton component="label" sx={{ mb: 2 }} disabled={isSubmitting}>
              <input accept="image/*" style={{ display: 'none'}} id="avatar-upload" type='file' onChange={handleAvatarUpload} />
              <Avatar sx={{ width: 100, height: 100, mb: 2 }} alt={userData.name} src={userData.avatarUrl} />
            </IconButton>
            <Typography variant="h4" component="div" sx={{ mb: 2 }}>
              {userData.name}
            </Typography>
            <Typography variant="body1" color="textSecondary" sx={{ mb: 3 }}>
              <strong>Email:</strong> {userData.email}
            </Typography>
          </Card>
        </Grid>

        {/* Правая часть - Форма для редактирования */}
        <Grid item xs={12} md={8}>
          {editing ? (
            <Card sx={{ p: 3 }}>
              <Typography variant="h5" gutterBottom>
                Редактировать профиль
              </Typography>
              <TextField
                fullWidth
                label="Имя"
                name="name"
                value={formData.name}
                onChange={handleChange}
                sx={{ mb: 2 }}
                disabled={isSubmitting}
              />
              <TextField
                fullWidth
                label="Email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                sx={{ mb: 3 }}
                disabled={isSubmitting}
              />
              <Button
                variant="contained"
                color="primary"
                onClick={handleSaveChanges}
                disabled={isSubmitting}
              >
                {isSubmitting ? 'Сохраняю...' : 'Сохранить изменения'}
              </Button>
            </Card>
          ) : (
            <Card sx={{ p: 3 }}>
              <Typography variant="h5" gutterBottom>
                Данные пользователя
              </Typography>
              <Typography variant="body1">
                <strong>Имя:</strong> {userData.name}
              </Typography>
              <Typography variant="body1" sx={{ mt: 2 }}>
                <strong>Email:</strong> {userData.email}
              </Typography>

              <Button
              variant="contained"
              color="primary"
              sx={{ mt:2, width: '20%' }}
              onClick={handleEditToggle}
            >
              {editing ? 'Сохранить' : 'Редактировать'}
            </Button>
            </Card>
          )}
        </Grid>
      </Grid>
    </Container>
  );
};

export default ProfilePage;
