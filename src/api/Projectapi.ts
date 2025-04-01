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

export const deleteProject = async (projectId: number) => {
  try{
    const token = localStorage.getItem("token");
    if (!token) {
      throw new Error("Токен отсутствует");
    }
    const response = await axios.delete(`${API_URL}/${projectId}`,{
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
  }catch(error){
    console.error("Error deleting project:", error);
  }
};

export const fetchMyProjects = async () => {
  try{
    const token = localStorage.getItem("token");
    if (!token) {
      throw new Error("Токен отсутствует");
    }
    const response = await axios.get(`${API_URL}/myproject`,{
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data
  } catch(error) {
    console.error("Error fetching my projects:", error);
  }
}

export const addUserToProject = async (projectId: number, userEmail: string) => {
  try {
    const token = localStorage.getItem("token");
    if (!token) {
      throw new Error("Токен отсутствует");
    }
    const response = await axios.post(
      `${API_URL}/${projectId}/members/${userEmail}`,
      {},
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );
    return response.data;
  } catch (error) {
    console.error("Ошибка при добавлении пользователя в проект:", error);
  }
};

export const deleteUserFromProject = async (projectId: number, userEmail: string) => {
  try {
    const token = localStorage.getItem("token");
    if (!token) {
      throw new Error("Токен отсутствует");
    }

    const response = await axios.delete(
      `${API_URL}/${projectId}/members/${userEmail}`,
      {headers: { Authorization: `Bearer ${token}` },});
    return response.data;
    } catch (error) {
    console.error("Ошибка при удалении пользователя из проекта:", error);
      }
}