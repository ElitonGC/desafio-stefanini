import { useState } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import LoginPage from './pages/Login';
import RegisterPage from './pages/Register';
import UsersPage from './pages/Users';

export default function App() {
   const [token, setToken] = useState(localStorage.getItem('token') || '');

   const handleSetToken = (t) => {
      setToken(t);
      localStorage.setItem('token', t);
   };

   const handleLogout = () => {
      setToken('');
      localStorage.removeItem('token');
   };

   return (
      <BrowserRouter>
         <Routes>
            <Route path="/login" element={<LoginPage setToken={handleSetToken} />} />
            <Route path="/register" element={<RegisterPage setToken={handleSetToken}/>} />
            <Route path="/users" element={token ? <UsersPage token={token} onLogout={handleLogout} /> : <Navigate to="/login" />} />
            <Route path="*" element={<Navigate to="/login" />} />
         </Routes>
      </BrowserRouter>
   );
}