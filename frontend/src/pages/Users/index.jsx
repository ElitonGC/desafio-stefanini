import { useState, useRef } from 'react';
import UserList from '../../components/UserList';
import UserForm from '../../components/UserForm';
import { Modal } from 'antd';
import { PoweroffOutlined } from '@ant-design/icons';

export default function UsersPage({ token, onLogout }) {
   const [editingUser, setEditingUser] = useState(null);
   const [modalVisible, setModalVisible] = useState(false);
   const userListRef = useRef();

   const handleEdit = (user) => {
      setEditingUser(user);
      setModalVisible(true);
   };

   const handleAdd = () => {
      setEditingUser(false);
      setModalVisible(true);
   };

   const handleCloseModal = () => {
      setEditingUser(null);
      setModalVisible(false);
   };

   // Função para atualizar a lista de usuários
   const refreshUsers = () => {
      if (userListRef.current) {
         userListRef.current.fetchUsers();
      }
   };

   return (
      <div style={{ maxWidth: 1200, margin: 'auto', marginTop: 50 }}>
         <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <h2>Usuários</h2>
            <button
               onClick={onLogout}
               style={{
                  padding: 8,
                  background: '#f5222d',
                  color: '#fff',
                  border: 'none',
                  borderRadius: '50%',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: 20,
               }}
               title="Logoff"
            >
               <PoweroffOutlined />
            </button>
         </div>
         <UserList ref={userListRef} token={token} onEdit={handleEdit} onAdd={handleAdd} />
         <Modal
            open={modalVisible}
            onCancel={handleCloseModal}
            footer={null}
            destroyOnClose
            title={editingUser ? "Editar Usuário" : "Novo Usuário"}
         >
            {editingUser && (
               <UserForm
                  initialValues={editingUser}
                  onSuccess={() => {
                     handleCloseModal();
                     refreshUsers();
                  }}
                  isEdit
                  token={token}
               />
            )}
            {!editingUser && (
               <UserForm
                  onSuccess={() => {
                     handleCloseModal();
                     refreshUsers();
                  }}
                  token={token}
               />
            )}
         </Modal>
      </div>
   );
}