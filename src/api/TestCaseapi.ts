import axios from 'axios';

const API_URL = 'http://localhost:3000/test-suites';

export const searchTestCase = async (suiteId:number, searchTerm:string) => {
    try {
        const response = await axios.get(`${API_URL}/${suiteId}/test-cases/search/${searchTerm}`,
        {
            params: { search: searchTerm },

        });
        return response.data;

    }catch(error){
        console.error('Ошибка при поиске тест-кейса', error);
        return [];
    }
}