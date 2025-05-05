import axios from 'axios';

const api = axios.create({
  baseURL: 'https://bailanysta-c3b9.onrender.com',
  headers: {
    'Content-Type': 'application/json'
  }
});

export default api;
