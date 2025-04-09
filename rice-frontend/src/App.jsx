// Update your App.js to include the interceptor
import { StrictMode } from 'react';
import { RouterProvider } from 'react-router-dom';
import router from './Router/routes';
import axios from 'axios';

function App() {
  // Add this axios interceptor
  axios.interceptors.request.use((config) => {
    const token = localStorage.getItem('authToken');
    if (token) {
      config.headers.Authorization = `Basic ${token}`;
    }
    return config;
  }, (error) => {
    return Promise.reject(error);
  });

  return (
    <StrictMode>
      <RouterProvider router={router} />
    </StrictMode>
  );
}

export default App;
