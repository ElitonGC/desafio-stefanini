import { useNavigate } from 'react-router-dom';
import UserForm from '../../components/UserForm';
import { Card } from 'antd';

export default function RegisterPage() {
   const navigate = useNavigate();

   const handleSignUp = () => {
      navigate('/login');
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
            title="Cadastro de Usuário"
            style={{ width: 400, boxShadow: '0 2px 8px #f0f1f2' }}
         >
            <UserForm onSuccess={handleSignUp} />
         </Card>
      </div>
   );
}