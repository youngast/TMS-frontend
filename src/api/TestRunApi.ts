import axios from 'axios';
import { TestRunStatus } from '../enums/TestRunStatus';

const API_URL = `http://localhost:3000/projects`;

export const getTestRuns = async (projectId:number) =>{
    const response = await axios.get(`${API_URL}/${projectId}/test-runs`);
    return response.data;
}

export const createTestRun = async (projectId: number, data: { 
    title: string; 
    description?: string; 
    testSuiteId?: number; 
    testCaseIds?: number[]; 
}) => {
    const response = await axios.post(`${API_URL}/${projectId}/test-runs`, data);
    return response.data;
};

export const addTestCaseToRun = async (projectId: number, testRunId: number, testCaseId: number) => {
    const response = await axios.post(`${API_URL}/${projectId}/test-runs/${testRunId}/add-test-case/${testCaseId}`);
    return response.data;
};

export const updateTestRun = async (projectId: number, testRunId: number, data: any) => {
    const response = await axios.patch(`${API_URL}/${projectId}/test-runs/${testRunId}`, data);
    return response.data;
};

export const deleteTestRun = async (projectId: number, testRunId: number) => {
    const response = await axios.delete(`${API_URL}/${projectId}/test-runs/${testRunId}`);
    return response.data;
};

export const getTestRunById = async (projectId: number, testRunId: number) => {
    const response = await axios.get(`${API_URL}/${projectId}/test-runs/${testRunId}`);
    return response.data;
};

export const updateTestCaseStatus = async (
    projectId: number, 
    testCaseId: number, 
    status: TestRunStatus
  ) => {
    return axios.patch(
      `http://localhost:3000/projects/${projectId}/test-runs/test-cases/${testCaseId}/status`,
      { status }
    );
  };
  

export const completeTestRun = async (projectId: number, testRunId: number) => {
    return axios.patch(`${API_URL}/${projectId}/test-runs/${testRunId}/complete`);
};

export const exportToPdf = async (projectId: number, testRunId: number) => {
  const response = await axios.get(
    `${API_URL}/${projectId}/test-runs/${testRunId}/export-to-pdf`,
    {
      responseType: 'blob',
    }
  );

  const url = window.URL.createObjectURL(new Blob([response.data]));
  const link = document.createElement('a');
  link.href = url;
  link.setAttribute('download', `testrun-${testRunId}.pdf`);
  document.body.appendChild(link);
  link.click();
  link.remove();
};