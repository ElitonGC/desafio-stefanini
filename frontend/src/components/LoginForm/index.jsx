import { Form, Input, Button, message } from 'antd';
import api from '../../api';
import { Link } from 'react-router-dom';

export default function LoginForm({ onLogin }) {
   const onFinish = async (values) => {
      try {
         const res = await api.post('/auth/login', values);
         if (![200, 201].includes(res.status)) throw new Error('Login failed');
         onLogin(res.data.access_token);
      } catch {
         message.error('CPF ou senha inválidos');
      }
   };

   return (
      <>
         <Form onFinish={onFinish} layout="vertical">
            <Form.Item name="cpf" label="CPF" rules={[{ required: true }]}>
               <Input />
            </Form.Item>
            <Form.Item name="password" label="Senha" rules={[{ required: true }]}>
               <Input.Password />
            </Form.Item>
            <Button type="primary" htmlType="submit" block>
               Entrar
            </Button>
         </Form>
         <div style={{ marginTop: 16, textAlign: 'center' }}>
            <span>Ainda não tem conta? </span>
            <Link to="/register">Cadastre-se</Link>
         </div>
      </>
   );
}