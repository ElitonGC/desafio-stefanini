import { useState, useEffect } from 'react';
import { Form, Input, Button, message } from 'antd';
import api from '../../api';
import { Link } from 'react-router-dom';
import formatCPF from '../../utils/formatCPF';

export default function LoginForm({ onLogin }) {
   const [cpf, setCpf] = useState('');
   const [form] = Form.useForm();

   // Atualiza o campo do formulário sempre que o CPF mudar
   useEffect(() => {
      form.setFieldsValue({ cpf });
   }, [cpf, form]);

   const onFinish = async (values) => {
      try {
         const res = await api.post('/auth/login', {
            ...values,
            cpf: cpf.replace(/\D/g, ''),
         });
         if (![200, 201].includes(res.status)) throw new Error('Login failed');
         onLogin(res.data.access_token);
      } catch {
         message.error('CPF ou senha inválidos');
      }
   };

   return (
      <>
         <Form form={form} onFinish={onFinish} layout="vertical">
            <Form.Item
               name="cpf"
               label="CPF"
               rules={[
                  { required: true, message: 'CPF é obrigatório' },
                  {
                     pattern: /^\d{3}\.\d{3}\.\d{3}-\d{2}$/,
                     message: 'Digite um CPF válido no formato 000.000.000-00',
                  },
               ]}
            >
               <Input
                  value={cpf}
                  onChange={e => setCpf(formatCPF(e.target.value))}
                  maxLength={14}
                  placeholder="000.000.000-00"
                  autoComplete="username"
               />
            </Form.Item>
            <Form.Item name="password" label="Senha" rules={[{ required: true }]}>
               <Input.Password autoComplete="current-password" />
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