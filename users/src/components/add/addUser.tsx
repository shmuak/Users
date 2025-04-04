import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAppDispatch } from "../../app/hooks";
import { createUser } from "../../app/usersSlice";

import './addUser.scss';
const AddUser = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    height: "",
    weight: "",
    gender: "Мужской",
    location: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const newUser = {
      ...formData,
      height: Number(formData.height),
      weight: Number(formData.weight),
    };

    dispatch(createUser(newUser));
    navigate("/"); 
  };

  return (
    <div className="add-user-container">
      <h2>Добавить нового пользователя</h2>
      <form onSubmit={handleSubmit} className="add-user-form">
        <input type="text" name="firstName" placeholder="Имя" value={formData.firstName} onChange={handleChange} required />
        <input type="text" name="lastName" placeholder="Фамилия" value={formData.lastName} onChange={handleChange} required />
        <input type="number" name="height" placeholder="Рост (см)" value={formData.height} onChange={handleChange} required />
        <input type="number" name="weight" placeholder="Вес (кг)" value={formData.weight} onChange={handleChange} required />
        
        <input type="text" name="location" placeholder="Локация" value={formData.location} onChange={handleChange} required />
        <select name="gender" value={formData.gender} onChange={handleChange}>
          <option value="Мужской">Мужской</option>
          <option value="Женский">Женский</option>
        </select>

        <button type="submit">Создать</button>
        <button type="button" onClick={() => navigate("/")}>Отмена</button>
      </form>
    </div>
  );
};

export default AddUser;
