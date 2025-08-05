import { Form, Input, Button, message, DatePicker, Select, Row, Col } from 'antd';
import api from '../../api';
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import { useEffect } from 'react';

dayjs.extend(utc);

export default function UserForm({ onSuccess, initialValues = {}, isEdit = false, token }) {
   const [form] = Form.useForm();

   // Preenche o formulário ao abrir para edição
   useEffect(() => {
      if (isEdit && initialValues) {
         form.setFieldsValue({
            ...initialValues,
            birthDate: initialValues.birthDate ? dayjs.utc(initialValues.birthDate) : null,
            password: '',
         });
      } else {
         form.resetFields();
      }
      // eslint-disable-next-line
   }, [initialValues, isEdit]);

   const onFinish = async (values) => {
      try {
         values.birthDate = values.birthDate.format('YYYY-MM-DD');
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
         }}
      >
         <Form.Item name="name" label="Nome" rules={[{ required: true }]}>
            <Input />
         </Form.Item>
         <Form.Item name="email" label="E-mail">
            <Input />
         </Form.Item>
         <Form.Item name="cpf" label="CPF" rules={[{ required: true }]}>
            <Input disabled={isEdit} />
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