import React from 'react';
import './App.css';
import { Route, RouterProvider, Routes } from 'react-router-dom';
import { Login } from './components/Account/Login';
import { Register } from './components/Account/Register';
import { RequireAuth } from './components/Account/RequireAuth';
import { CarsPage } from './pages/Cars/CarsPage';
import { HomePage } from './pages/HomePage';
import { ROLES } from './public/consts';
import { router } from './public/consts'
import { ThemeProvider, createTheme } from '@mui/material';


export const ThemeContext = React.createContext('tasks');

const App: React.FC = function () {


  const theme = createTheme({
        palette: {
          primary: {
            main: "#69bfbf"
        },
          secondary: {
            main: "#d5e8e8"
          }
    }
  });

  return (
    <ThemeProvider theme={theme}>
      <div className="App">
        <RouterProvider router={router} />
      </div>
    </ThemeProvider>
  );
}

export default App;