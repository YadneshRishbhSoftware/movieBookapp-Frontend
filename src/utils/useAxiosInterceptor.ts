// src/hooks/useAxiosInterceptor.ts
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axiosInstance from '../axiosConfig'; // Adjust path
import { useDispatch } from 'react-redux';
import { logout } from '../authSlice'; // Adjust path to your auth slice

const useAxiosInterceptor = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  useEffect(() => {
    const interceptor = axiosInstance.interceptors.response.use(
      (response) => response,
      (error) => {
        if (error.response && error.response.status === 401) {
          // Dispatch the logout action
          dispatch(logout());

          // Redirect to login page
          navigate('/login');
        }
        return Promise.reject(error);
      }
    );

    // Eject the interceptor on component unmount
    return () => {
      axiosInstance.interceptors.response.eject(interceptor);
    };
  }, [navigate, dispatch]);
};

export default useAxiosInterceptor;
