import React from 'react';
import './App.css';
import { RouterProvider } from 'react-router-dom';
import { router } from './common/routes'
import { ThemeProvider, createTheme } from '@mui/material';
import { GoogleOAuthProvider } from '@react-oauth/google';
import { mainTheme } from './common/themes';
import { CLIENT_ID } from './common/externalAuthConfig';
import { authStore } from './store/authStore';


export const ThemeContext = React.createContext('tasks');

const App: React.FC = function () {

    authStore.trySetAuth();

    return (
        <GoogleOAuthProvider clientId={CLIENT_ID}>
            <ThemeProvider theme={mainTheme}>
                <div className="App">
                    <RouterProvider router={router} />
                </div>
            </ThemeProvider>
        </GoogleOAuthProvider>
    );
}

export default App;