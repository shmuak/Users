import { useState } from 'react';
import { User } from '../../types/types';
import { EditOutlined, DeleteOutlined, SaveOutlined, CloseOutlined } from "@ant-design/icons";
import { Input, Select } from 'antd';
import './Item.scss';

interface UserItem {
  user: User;
  onDelete: (id: number) => void;
  onUpdate: (id: number, updatedUser: Partial<User>) => Promise<void>;
}

const UserItem = ({ user, onDelete, onUpdate }: UserItem) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editedUser, setEditedUser] = useState<Partial<User>>({ ...user });

  const handleInputChange = (field: keyof User, value: string | number) => {
    setEditedUser(prev => ({ ...prev, [field]: value }));
  };

  const handleSave = async () => {
    try {
      await onUpdate(user.id, editedUser);
      setIsEditing(false);
    } catch (error) {
      console.error('Failed to update user:', error);
    }
  };

  const handleCancel = () => {
    setEditedUser({ ...user });
    setIsEditing(false);
  };

  return (
    <div className='item-wrapper'>
      <div className='item-profile'>
        <div className='item-photo'>  
          <img 
            src={user.photo || "../../../public/assets/default-icon.png"} 
            alt="фото" 
            onError={(e) => {
              (e.target as HTMLImageElement).src = "../../../public/assets/default-icon.png";
            }}
          />
        </div>
        
        {isEditing ? (
          <div className='item-info edit-mode'>
            {['firstName', 'lastName', 'location'].map(field => (
              <div key={field} className='edit-field'>
                <span className='edit-label'><strong>{field === 'firstName' ? 'Имя' : field === 'lastName' ? 'Фамилия' : 'Локация'}:</strong></span>
                <Input 
                  value={editedUser[field as keyof User] || ''}
                  onChange={(e) => handleInputChange(field as keyof User, e.target.value)} 
                />
              </div>
            ))}
            <div className='edit-field'>
              <span className='edit-label'><strong>Рост:</strong></span>
              <Input 
                type="number"
                value={editedUser.height || ''}
                onChange={(e) => handleInputChange('height', parseInt(e.target.value) || 0)}
                addonAfter="cm"
              />
            </div>
            <div className='edit-field'>
              <span className='edit-label'><strong>Вес:</strong></span>
              <Input 
                type="number"
                value={editedUser.weight || ''}
                onChange={(e) => handleInputChange('weight', parseInt(e.target.value) || 0)}
                addonAfter="kg"
              />
            </div>
            <div className='edit-field'>
              <span className='edit-label'><strong>Пол:</strong></span>
              <Select
                value={editedUser.gender}
                onChange={(value) => handleInputChange('gender', value)}
                style={{ width: '100%' }}
              >
                <Select.Option value="male">Мужской</Select.Option>
                <Select.Option value="female">Женский</Select.Option>
                <Select.Option value="other">Другой</Select.Option>
              </Select>
            </div>
          </div>
        ) : (
          <div className='item-info'>
            <span><strong>{user.firstName} {user.lastName}</strong></span>
            <span><strong>Рост:</strong> {user.height} cm</span>
            <span><strong>Вес:</strong> {user.weight} kg</span>
            <span><strong>Пол:</strong> {user.gender}</span>
            <span><strong>Локация:</strong> {user.location}</span>
          </div>
        )}
      </div>

      <div className='item-buttons'>
        {isEditing ? (
          <>
            <button className='save-btn' onClick={handleSave} aria-label="Save">
              <SaveOutlined />
            </button>
            <button className='cancel-btn' onClick={handleCancel} aria-label="Cancel">
              <CloseOutlined />
            </button>
          </>
        ) : (
          <>
            <button className='edit-btn' onClick={() => setIsEditing(true)} aria-label="Edit">
              <EditOutlined />
            </button>
            <button 
              className='delete-btn'
              onClick={() => onDelete(user.id)}
              aria-label="Delete"
            >
              <DeleteOutlined />
            </button>
          </>
        )}
      </div>
    </div>
  );
};

export default UserItem;