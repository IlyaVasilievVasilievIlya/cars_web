import React from 'react';
import './App.css';
import { Route, RouterProvider, Routes } from 'react-router-dom';
import { Login } from './components/Account/Users/Login';
import { Register } from './components/Account/Users/Register';
import { RequireAuth } from './components/Account/Users/RequireAuth';
import { CarsPage } from './pages/Cars/CarsPage';
import { HomePage } from './pages/HomePage';
import { ROLES } from './public/consts';
import { router } from './public/consts'


export const ThemeContext = React.createContext('tasks');

const App: React.FC = function () {

  return (
    <div className="App">
      <RouterProvider router={router} />
    </div>
  );
}

export default App;