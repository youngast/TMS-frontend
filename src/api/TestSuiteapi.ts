import axios from "axios";

const API_URL = `http://localhost:3000/projects`;

const SearchTestSuites = async (projectId: number, search: string) => {
    try{
        const response = await axios.get(`${API_URL}/${projectId}/test-suites/search`,
        {
            params: {
                search: search,
            },
        });
        return response.data;
    } catch(error){
        console.error('Ошибка при поиске test suite', error);
        return [];
    }
};