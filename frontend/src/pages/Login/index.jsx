import { useNavigate } from 'react-router-dom';
import LoginForm from '../../components/LoginForm';
import { Card } from 'antd';

export default function LoginPage({ setToken }) {
   const navigate = useNavigate();

   const handleLogin = (token) => {
      setToken(token);
      navigate('/users');
   };

   return (
      <div
         style={{
            minHeight: '100vh',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            background: '#f0f2f5'
         }}
      >
         <Card
            title="Login"
            style={{ width: 350, boxShadow: '0 2px 8px #f0f1f2' }}
         >
            <LoginForm onLogin={handleLogin} />
         </Card>
      </div>
   );
}