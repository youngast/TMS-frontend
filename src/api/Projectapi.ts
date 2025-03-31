import axios from 'axios';

const API_URL = 'http://localhost:3000/projects';

export async function findProjectByName(name: string) {
    const token = localStorage.getItem('token');
  try {
    const response = await axios.get(`${API_URL}/name`, {
      headers: { Authorization: `Bearer ${token}` },
      params: { name },
    });
    return response.data;
  } catch (err) {
    console.error('Ошибка при поиске проекта:', err);
    throw err;
  }
}
