import axios from 'axios';

const API_URL = `http://localhost:3000/projects`;

export const getTestRuns = async (projectId:number) =>{
    const response = await axios.get(`${API_URL}/${projectId}/test-runs`);
    return response.data;
}

export const createTestRun = async (projectId: number, data: any) => {
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
