import React from 'react';
import './App.css';
import { RouterProvider } from 'react-router-dom';
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