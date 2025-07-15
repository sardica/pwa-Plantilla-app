import axios from 'axios';

// Creamos una instancia de axios con configuración predeterminada para nuestra API.
const api = axios.create({
  baseURL: 'http://localhost:8000/api',
  withCredentials: true
});

export default api;
