import { useEffect } from 'react';
import { RouterProvider } from 'react-router-dom';
import axios from 'axios';
import router from './Router/routes';

function App() {
  useEffect(() => {
    const interceptorId = axios.interceptors.request.use(
      (config) => {
        const token = localStorage.getItem('authToken');
        if (token) {
          config.headers.Authorization = `Basic ${token}`;
        }
        return config;
      },
      (error) => Promise.reject(error)
    );
    return () => {
      axios.interceptors.request.eject(interceptorId);
    };
  }, []);

  return <RouterProvider router={router} />;
}

export default App;
