import axios from 'axios';

// Create an instance of axios
const axiosInstance = axios.create({
  baseURL: 'http://localhost:4000',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add a request interceptor to include the token in the headers
axiosInstance.interceptors.request.use(
  (config) => {
    // Retrieve the token from localStorage (or any other storage you are using)
    const token = localStorage.getItem('token');

    if (token) {
      // Attach the token to the Authorization header
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => {
    // Handle the error
    return Promise.reject(error);
  }
);

export default axiosInstance;
