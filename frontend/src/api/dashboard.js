import axios from 'axios';
export const fetchAdminDashboard = async () => {
    const response = await axios.get('/api/dashboard/admin');
    return response.data;
};
export const fetchPymeDashboard = async (userId) => {
    const response = await axios.get(`/api/dashboard/pyme/${userId}`);
    return response.data;
};
export const fetchRecyclerDashboard = async (userId) => {
    const response = await axios.get(`/api/dashboard/reciclador/${userId}`);
    return response.data;
};
