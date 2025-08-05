import { useState, useRef } from 'react';
import UserList from '../../components/UserList';
import UserForm from '../../components/UserForm';
import { Modal, Layout } from 'antd';
import { PoweroffOutlined } from '@ant-design/icons';

const { Header, Content } = Layout;

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
      <Layout style={{ minHeight: '100vh', background: '#f0f2f5' }}>
         <Header
            style={{
               background: '#fff',
               display: 'flex',
               justifyContent: 'space-between',
               alignItems: 'center',
               boxShadow: '0 2px 8px #f0f1f2',
               padding: '0 32px',
            }}
         >
            <h2 style={{ margin: 0 }}>Usuários</h2>
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
         </Header>
         <Content style={{ maxWidth: 1200, margin: '40px auto', width: '100%' }}>
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
         </Content>
      </Layout>
   );
}