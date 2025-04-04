import { useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '../../app/hooks';
import { useNavigate } from 'react-router-dom';
import { fetchUsers, deleteUser, setCurrentPage, updateUser } from '../../app/usersSlice';
import UserItem from '../item/Item';
import './List.scss';
import { User } from '../../types/types';

const UsersList: React.FC = () => {
  const dispatch = useAppDispatch();
  const { users, status, pagination } = useAppSelector((state) => state.users);
  const navigate = useNavigate();
  const { currentPage, totalPages } = pagination;

  useEffect(() => {
    dispatch(fetchUsers(currentPage));
  }, [dispatch, currentPage]);

  const handleDelete = (id: number) => {
    if (window.confirm('Вы уверены, что хотите удалить пользователя?')) {
      dispatch(deleteUser(id));
    }
  };

  const handlePageChange = (newPage: number) => {
    if (newPage >= 1 && newPage <= totalPages) {
      dispatch(setCurrentPage(newPage));
    }
  };

  const handleUpdateUser = async (id: number, updatedUser: Partial<User>) => {
    try {
      await dispatch(updateUser({ id, userData: updatedUser })).unwrap();
    } catch (error) {
      console.error('Failed to update user:', error);
      throw error; 
    }
  };
  
  if (status === 'loading') return <div>Загрузка...</div>;
  if (!users || users.length === 0) return <div>Нет доступных пользователей</div>;

  return (
    <div className="users-container">
      <h2>Список пользователей</h2>

      <button className="add-user-btn" onClick={() => navigate('/add-user')}>
        Добавить пользователя
      </button>

      {users.map(user => (
        <UserItem
          key={user.id} 
          user={user} 
          onDelete={handleDelete} 
          onUpdate={handleUpdateUser} 
        />
      ))}

      <div className="pagination">
        <span className="pagination-info">Страница {currentPage} из {totalPages}</span>
        <div className="pagination-controls">
          <button disabled={currentPage === 1} onClick={() => handlePageChange(currentPage - 1)}>
            Назад
          </button>
          <button disabled={currentPage === totalPages} onClick={() => handlePageChange(currentPage + 1)}>
            Вперед
          </button>
        </div>
      </div>
    </div>
  );
};

export default UsersList;
