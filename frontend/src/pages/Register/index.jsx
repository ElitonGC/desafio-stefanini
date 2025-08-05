import { useNavigate } from 'react-router-dom';
import UserForm from '../../components/UserForm';

export default function RegisterPage() {
   const navigate = useNavigate();

   const handleSignUp = () => {
      navigate('/login');
   };

   return (
      <div style={{ maxWidth: 500, margin: 'auto', marginTop: 50 }}>
         <h2>Cadastro de Usuário</h2>
         <UserForm onSuccess={handleSignUp} />
      </div>
   );
}