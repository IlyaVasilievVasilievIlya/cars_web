import React from 'react';
import './App.css';
import { RouterProvider } from 'react-router-dom';
import { router } from './common/consts'
import { ThemeProvider, createTheme } from '@mui/material';
import { GoogleOAuthProvider } from '@react-oauth/google';


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
<GoogleOAuthProvider clientId='988926003922-5fbkhh1237pc8iarra7f3u3larfplt4v.apps.googleusercontent.com'>
        <ThemeProvider theme={theme}>
            <div className="App">
                <RouterProvider router={router} />
            </div>
        </ThemeProvider>
</GoogleOAuthProvider>
    );
}

export default App;