import axios from "axios";
import { Step } from "../pages/ProjectDetails";
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

  try {
    const response = await axios.get(`http://localhost:3000/auth/me`, {
      headers: { Authorization: `Bearer ${token}` },
    });

    return response.data;
  } catch (error) {
    console.error("Ошибка получения текущего пользователя:", error);
    return null;
  }
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
    console.log("Получены тест-кейсы:", response.data);
    return response.data;
  } catch (error) {
    console.error(`Ошибка при загрузке тест-кейсов для suiteId=${suiteId}:`, error);
    return [];
  }
};

export const fetchTestCasesBySuiteId = async (testSuiteId: number) => {
  try {
    const response = await axios.get(`${API_URL}/test-suites/${testSuiteId}/test-cases`);
    return response.data;
  } catch (error) {
    console.error(`Ошибка при загрузке тест-кейсов для testSuiteId=${testSuiteId}:`, error);
    return [];
  }
};

export const fetchTestCaseById = async (testCaseId: number) => {
  try {
    const response = await axios.get(`${API_URL}/test-suites/:testSuiteId/test-cases/${testCaseId}`);
    return response.data;
  } catch (error) {
    console.error(`Ошибка при загрузке тест-кейса id=${testCaseId}:`, error);
    throw error;
  }
};

export const fetchTestSuitesByProjectId = async (projectId: number) => {
  const response = await axios.get(`${API_URL}/projects/${projectId}/test-suites`);
  return response.data;
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

export const createTestCase = async (testSuiteId: number, testCaseData: { 
  title: string; 
  description?: string; 
  steps: Step[]; // <-- Исправил, чтобы steps не был всегда пустым
  expectedResult?: string; 
  status?: string;
}) => {
try {
  console.log("Отправляем тест-кейс:", testCaseData); // <-- Логируем, что отправляем
  const response = await axios.post(`${API_URL}/test-suites/${testSuiteId}/test-cases`, testCaseData);
  console.log("Ответ сервера:", response.data); // <-- Логируем, что пришло от сервера
  return response.data;
} catch (error) {
  console.error(`Ошибка при создании тест-кейса в testSuiteId=${testSuiteId}:`, error);
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

export const updateTestSuite = async (projectId: number, suiteId: number, data: any) => {
  const token = localStorage.getItem("token");
  if (!token) {
    throw new Error("Токен отсутствует");
  }

  const response = await axios.patch(
    `http://localhost:3000/projects/${projectId}/test-suites/${suiteId}`,
    data,
    {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    }
  );

  return response.data;
};

export const updateTestCase = async (testCaseId: number, testCaseData: { title?: string; description?: string; steps?: []; expectedResult?: string; status?: string }) => {
  try {
    await axios.patch(`${API_URL}/test-suites/:testSuiteId/test-cases/${testCaseId}`, testCaseData);
  } catch (error) {
    console.error(`Ошибка при обновлении тест-кейса id=${testCaseId}:`, error);
    throw error;
  }
};


export const deleteTestSuite = async (projectId:number,suiteId: number) => {
  const token = localStorage.getItem("token");
  const response = await axios.delete(`http://localhost:3000/projects/${projectId}/test-suites/${suiteId}`, {
    headers: { Authorization: `Bearer ${token}` },});
  return response.data;
};

export const deleteTestCase = async (testCaseId: number) => {
  try {
    await axios.delete(`${API_URL}/test-suites/:testSuiteId/test-cases/${testCaseId}`);
  } catch (error) {
    console.error(`Ошибка при удалении тест-кейса id=${testCaseId}:`, error);
    throw error;
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



export const fetchUsers = async (email: string) => {
  const token = localStorage.getItem("token");
  if (!token) {
    throw new Error("Токен отсутствует");
  }
  const response = await axios.get(`http://localhost:3000/users/`, {
    headers: { Authorization: `Bearer ${token}` },
    params: { email },
  });
  return response.data;
};