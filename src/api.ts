import axios from "axios";

export interface Project {
    id:number,
    name: string,
    owner: string,
    testdefects: number,
    testruns: number,
    version: string,
    users: number;
}

const API_URL = "http://localhost:3000";
const API_PROJECT_URL = "http://localhost:3000/projects";

export const login = async (email: string, password: string) => {
  const response = await axios.post(`http://localhost:3000/auth/login`, { email, password });
  const { accessToken } = response.data;

  console.log("Токен:", accessToken); 

  localStorage.setItem("token", accessToken);
  return accessToken;
};

export const register = async (email:string , name:string , password: string) =>{
  const response = await axios.post(`http://localhost:3000/auth/register`, { email, name, password });
  return response.data;
}

export const fetchUsersLogin = async () => {
  const token = localStorage.getItem("token");
  if (!token) {
    throw new Error("Токен отсутствует");
  }

  try {
    const response = await axios.get(`${API_URL}/users`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
  } catch (error) {
    console.error("Ошибка при загрузке пользователей:", error);
    return [];
  }
}

export const fetchCurrentUser = async () => {
  const token = localStorage.getItem("token");
  if (!token) return null;

  const response = await fetch(`${API_URL}/users/me`, {
    headers: { Authorization: `Bearer ${token}` },
  });

  if (!response.ok) throw new Error("Ошибка авторизации");

  return response.json();
};



export const fetchProjects = async () => {
  const token = localStorage.getItem("token");
  if (!token) {
    console.error("Токен отсутствует");
    return [];
  }

  try {
    console.log("Загружаем проекты...");

    const response = await axios.get(`${API_URL}/projects`, {
      headers: { Authorization: `Bearer ${token}` },
    });

    console.log("Проекты:", response.data);
    return response.data;
  } catch (error) {
    console.error("Ошибка при загрузке проектов:", error);
    return [];
  }
}


export const createProject = async (projectData: { name: string; description: string }) => {
  const token = localStorage.getItem("token");
  if (!token) {
    throw new Error("Токен отсутствует");
  }

  console.log("Отправляем запрос на создание проекта:", projectData);

  const response = await axios.post(`${API_URL}/projects`, projectData, {
    headers: { Authorization: `Bearer ${token}` },
  });

  console.log("Проект создан:", response.data);
  return response.data;
};

export const fetchProjectById = async (id: number) => {
  const token = localStorage.getItem("token");
  if (!token) {
    throw new Error("Токен отсутствует");
  }

  const response = await axios.get(`${API_PROJECT_URL}/${id}`, {
    headers: { Authorization: `Bearer ${token}` },
  });

  return response.data;
}

export const fetchTestSuites = async (projectId: number) => {
  const token = localStorage.getItem("token");
  if (!token) {
    throw new Error("Токен отсутствует");
  }
  const response = await axios.get(`${API_PROJECT_URL}/${projectId}/test-suites`, {
    headers: { Authorization: `Bearer ${token}` },
  });

  return response.data;
}

export const fetchTestCases = async (suiteId: number) => {
  console.log(`📡 Отправляем запрос: GET http://localhost:3000/test-suites/${suiteId}/test-cases`);
  
  try {
    const response = await axios.get(`http://localhost:3000/test-suites/${suiteId}/test-cases`);
    console.log("✅ Получены тест-кейсы:", response.data);
    return response.data;
  } catch (error) {
    console.error(`❌ Ошибка при загрузке тест-кейсов для suiteId=${suiteId}:`, error);
    return []; // ✅ Возвращаем пустой массив, чтобы не ломать UI
  }
};

export const fetchTestSuitesByProjectId = async (projectId: number) => {
  try {
    const response = await axios.get(`${API_URL}/projects/${projectId}/test-suites`);
    return response.data;
  } catch (error) {
    console.error(`❌ Ошибка при загрузке тест-сьютов проекта ID=${projectId}:`, error);
    throw error;
  }
};

export const fetchTestRuns = async (suiteId: number, caseId: number) => {
  try{
    const response = await axios.get(`http://localhost:3000/test-suites/${suiteId}/test-cases/${caseId}/test-runs`);
    return response.data;
  }catch(error){
    console.error("Error fetching test runs:", error);
  return [];}
};

export const createTestSuite = async (projectId: number, name: string) => {
  const response = await axios.post(`${API_PROJECT_URL}/${projectId}/test-suites`, { name });
  return response.data;
};

export const createTestCase = async (suiteId: number, title: string) => {
  if (!suiteId || isNaN(suiteId) || !title.trim()) {
    throw new Error("Некорректные данные для создания тест-кейса");
  }

  console.log(`📡 Отправляем запрос: POST http://localhost:3000/test-suites/${suiteId}/test-cases`);

  try {
    const response = await axios.post(`http://localhost:3000/test-suites/${suiteId}/test-cases`, {
      title,
    });
    console.log("✅ Тест-кейс создан:", response.data);
    return response.data;
  } catch (error) {
    console.error(`❌ Ошибка при создании тест-кейса в suiteId=${suiteId}:`, error);
    throw error;
  }
};

export const createTestRun = async (suiteId: number, caseId: number, title: string, description: string) => {
  if (!suiteId || isNaN(suiteId) || !caseId || isNaN(caseId) || !title.trim() || !description.trim()) {
    throw new Error("Некорректные данные для создания тест-рана");
  }

  const response = await axios.post(`http://localhost:3000/test-suites/${suiteId}/test-cases/${caseId}/test-runs`, {
    title,
    description,
    status: "ONWORK",
    executionTime: 0,
  });

  return response.data;
};

export const deleteTestSuite = async (suiteId: number) => {
  const response = await axios.delete(`${API_PROJECT_URL}/${suiteId}`);
  return response.data;
};

export const deleteProject = async (projectId: number) => {
  try{
    const token = localStorage.getItem("token");
    if (!token) {
      throw new Error("Токен отсутствует");
    }
    const response = await axios.delete(`${API_PROJECT_URL}/${projectId}`,{
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
  }catch(error){
    console.error("Error deleting project:", error);
  }
};



export const addUserToProject = async (projectId: number, userId: number) => {
  try {
    const token = localStorage.getItem("token");
    if (!token) {
      throw new Error("Токен отсутствует");
    }

    const response = await axios.post(
      `${API_PROJECT_URL}/${projectId}/members/${userId}`,
      {}, // Пустое тело запроса
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );
    return response.data;
  } catch (error) {
    console.error("Ошибка при добавлении пользователя в проект:", error);
  }
};



export const fetchUsers = async (id?: number, email?: string) => {
  const token = localStorage.getItem("token");
  if (!token) {
    throw new Error("Токен отсутствует");
  }

  const params: Record<string, any> = {};
  if (id) params.id = id;
  if (email) params.email = email;

  const response = await axios.get(`${API_URL}/users`, {
    headers: { Authorization: `Bearer ${token}` },
    params,
  });

  return response.data;
};
