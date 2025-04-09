import axios from "axios";

const API_URL = `http://localhost:3000/users`;

export const uploadAvatar = async (userId: number, file: File) => {
    const token = localStorage.getItem("token");
    const formData = new FormData();
    formData.append("avatar", file);
    const response = await axios.post(`${API_URL}/upload-avatar/${userId}`, formData, {
        headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
        },
    });
    return response.data;
}
  


export const getAvatar = async (userId: number) => {
    try{
        const token = localStorage.getItem("token");
        const response = await axios.get(`${API_URL}/${userId}/avatar`,
            {
                headers: { Authorization: `Bearer ${token}` },
            }
        );
        return response.data;
    }catch(error){
        console.error("Error getting avatar:", error);
    }
}