import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Provider } from 'react-redux';
import './App.css';
import UsersList from './components/list/List';
import AddUser from './components/add/addUser';
import { store } from './app/store';

function App() {
  return (
    <Provider store={store}>
      <Router>
        <Routes>
          <Route path="/" element={<UsersList />} />
          <Route path="/add-user" element={<AddUser />} />
        </Routes>
      </Router>
    </Provider>
  );
}

export default App;
