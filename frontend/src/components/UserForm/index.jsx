import { Form, Input, Button, message, DatePicker, Select, Row, Col } from 'antd';
import api from '../../api';
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import { useState, useEffect } from 'react';
import formatCPF from '../../utils/formatCPF';

dayjs.extend(utc);

export default function UserForm({ onSuccess, initialValues = {}, isEdit = false, token }) {
   const [form] = Form.useForm();
   const [cpf, setCpf] = useState('');

   // Preenche o formulário ao abrir para edição
   useEffect(() => {
      if (isEdit && initialValues) {
         setCpf(formatCPF(initialValues.cpf || ''));
         form.setFieldsValue({
            ...initialValues,
            birthDate: initialValues.birthDate ? dayjs.utc(initialValues.birthDate) : null,
            password: '',
            cpf
         });
      } 
      // eslint-disable-next-line
   }, [initialValues, isEdit]);

   // Atualiza o campo do formulário sempre que o CPF mudar
   useEffect(() => {
      form.setFieldsValue({ cpf });
   }, [cpf, form]);

   const onFinish = async (values) => {
      try {
         values.birthDate = values.birthDate.format('YYYY-MM-DD');
         values.cpf = cpf.replace(/\D/g, ''); // Remove máscara antes de enviar
         let res;
         if (isEdit) {
            api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
            if (values.password === "") delete values.password;
            res = await api.patch(`/users/${initialValues.id}`, values);
            if (![200, 201].includes(res.status)) throw new Error('Erro ao atualizar');
            message.success('Usuário atualizado!');
            onSuccess && onSuccess();
         } else {
            res = await api.post('/auth/signup', values);
            if (![200, 201].includes(res.status)) throw new Error('Erro ao cadastrar');
            message.success('Usuário cadastrado!');
            onSuccess && onSuccess(res.data?.access_token);
         }
      } catch {
         message.error(isEdit ? 'Erro ao atualizar usuário' : 'Erro ao cadastrar usuário');
      }
   };

   return (
      <Form
         form={form}
         onFinish={onFinish}
         layout="vertical"
         initialValues={{
            ...initialValues,
            birthDate: initialValues.birthDate ? dayjs.utc(initialValues.birthDate) : null,
            cpf: formatCPF(initialValues.cpf || ''),
         }}
      >
         <Form.Item name="name" label="Nome" rules={[{ required: true }]}>
            <Input />
         </Form.Item>
         <Form.Item name="email" label="E-mail">
            <Input />
         </Form.Item>
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
               disabled={isEdit}
               value={cpf}
               onChange={e => setCpf(formatCPF(e.target.value))}
               maxLength={14}
               placeholder="000.000.000-00"
            />
         </Form.Item>
         <Form.Item
            name="password"
            label="Senha"
            rules={isEdit ? [] : [{ required: true, min: 6 }]}
            extra={isEdit ? 'Preencha apenas se desejar alterar a senha.' : ''}
         >
            <Input.Password />
         </Form.Item>
         <Row gutter={16}>
            <Col span={12}>
               <Form.Item name="birthDate" label="Data de Nascimento" rules={[{ required: true }]}>
                  <DatePicker format="DD/MM/YYYY" style={{ width: '100%' }} />
               </Form.Item>
            </Col>
            <Col span={12}>
               <Form.Item name="gender" label="Sexo">
                  <Select
                     placeholder="Selecione"
                     allowClear
                     options={[
                        { label: 'Masculino', value: 'Masculino' },
                        { label: 'Feminino', value: 'Feminino' },
                        { label: 'Outro', value: 'Outro' },
                        { label: 'Prefiro não informar', value: 'Prefiro não informar' },
                     ]}
                  />
               </Form.Item>
            </Col>
         </Row >
         <Row gutter={16}>
            <Col span={12}>
               <Form.Item name="placeOfBirth" label="Naturalidade">
                  <Input />
               </Form.Item>
            </Col>
            <Col span={12}>
               <Form.Item name="nationality" label="Nacionalidade">
                  <Input />
               </Form.Item>
            </Col>
         </Row>
         <Button type="primary" htmlType="submit" block>
            {isEdit ? 'Salvar' : 'Cadastrar'}
         </Button>
      </Form >
   );
}