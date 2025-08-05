import { useNavigate } from 'react-router-dom';
import LoginForm from '../../components/LoginForm';

export default function LoginPage({ setToken }) {
   const navigate = useNavigate();

   const handleLogin = (token) => {
      setToken(token);
      navigate('/users');
   };

   return (
      <div style={{ maxWidth: 400, margin: 'auto', marginTop: 100 }}>
         <h2>Login</h2>
         <LoginForm onLogin={handleLogin} />
      </div>
   );
}