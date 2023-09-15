import axios from 'axios';

const apiClient = axios.create({
  baseURL: 'http://localhost:3001', // Replace with your Express.js server URL
});

export default apiClient;