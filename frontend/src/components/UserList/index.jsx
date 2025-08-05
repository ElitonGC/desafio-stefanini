import { Table, Button, Popconfirm, message } from 'antd';
import { EditOutlined, DeleteOutlined, PlusOutlined } from '@ant-design/icons';
import React, { useEffect, useState, forwardRef, useImperativeHandle } from 'react';
import api from '../../api';
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import formatCPF from '../../utils/formatCPF';

dayjs.extend(utc);

const UserList = forwardRef(({ token, onEdit, onAdd }, ref) => {
   const [users, setUsers] = useState([]);
   const [loading, setLoading] = useState(false);

   const fetchUsers = () => {
      setLoading(true);
      api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      api.get('/users')
         .then(res => setUsers(res.data))
         .finally(() => setLoading(false));
   };

   useImperativeHandle(ref, () => ({
      fetchUsers,
   }));

   useEffect(() => {
      fetchUsers();
      // eslint-disable-next-line
   }, [token]);

   const handleDelete = async (id) => {
      setLoading(true);
      try {
         await api.delete(`/users/${id}`);
         message.success('Usuário removido!');
         setUsers(users.filter(user => user.id !== id));
      } catch {
         message.error('Erro ao remover usuário');
      } finally {
         setLoading(false);
      }
   };

   const columns = [
      { title: 'Nome', dataIndex: 'name' },
      {
         title: 'CPF',
         dataIndex: 'cpf',
         render: (cpf) => formatCPF(cpf),
      },
      { title: 'E-mail', dataIndex: 'email' },
      {
         title: 'Data de Nascimento',
         dataIndex: 'birthDate',
         render: (date) => date ? dayjs.utc(date).format('DD/MM/YYYY') : '',
      },
      { title: 'Sexo', dataIndex: 'gender' },
      { title: 'Naturalidade', dataIndex: 'placeOfBirth' },
      { title: 'Nacionalidade', dataIndex: 'nationality' },
      {
         title: 'Ações',
         key: 'actions',
         render: (_, record) => (
            <>
               <Button
                  type="link"
                  icon={<EditOutlined />}
                  onClick={() => onEdit && onEdit(record)}
                  style={{ marginRight: 8 }}
               />
               <Popconfirm
                  title="Tem certeza que deseja remover?"
                  onConfirm={() => handleDelete(record.id)}
                  okText="Sim"
                  cancelText="Não"
               >
                  <Button type="link" danger icon={<DeleteOutlined />} />
               </Popconfirm>
            </>
         ),
      },
   ];

   return (
      <>
         <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: 16 }}>
            <Button
               type="primary"
               icon={<PlusOutlined />}
               onClick={onAdd}
               shape="circle"
               title="Novo Usuário"
            />
         </div>
         <Table dataSource={users} columns={columns} rowKey="id" loading={loading} />
      </>
   );
});

export default UserList;