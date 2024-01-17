import React from 'react';
import './App.css';
import { Route, Routes } from 'react-router-dom';
import { Login } from './components/Account/Users/Login';
import { Register } from './components/Account/Users/Register';
import { RequireAuth } from './components/Account/Users/RequireAuth';
import { CarsPage } from './pages/Cars/CarsPage';
import { HomePage } from './pages/HomePage';


export const ThemeContext = React.createContext('tasks');

const App: React.FC = function () {

  return (
    <div className="App">
      <Routes>
        <Route path="login" element={<Login/>} />
        <Route path="register" element={<Register/>}/>
        {/* <Route path="unathorized" element={<Unathorized />} /> */}

        <Route element={<RequireAuth allowedRoles={["User", "SuperUser", "Administrator", "Moderator"]}/>}>
          <Route path="/" element={<HomePage />}/>
          <Route path="/cars" element={<CarsPage />}/>
          <Route path="/users" element={<CarsPage />}/>
        </Route>
      </Routes>
    </div>
  );
}

export default App;