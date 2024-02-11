import React, { useEffect, useLayoutEffect, useState } from 'react';
import './App.css';
import { RouterProvider } from 'react-router-dom';
import { router } from './common/routes'
import { ThemeProvider } from '@mui/material';
import { GoogleOAuthProvider } from '@react-oauth/google';
import { mainTheme } from './common/themes';
import { CLIENT_ID } from './common/externalAuthConfig';
import { authStore } from './store/authStore';


const App: React.FC = function () {

    const [isLoading, setIsLoading] = useState(true);

    useEffect( () => {
        setTimeout(() => {
        if (!authStore.authChecked) {
                authStore.checkAuth().finally(() => setIsLoading(false));
            };
        }, 300)}, []) 

    return (
        <GoogleOAuthProvider clientId={CLIENT_ID}>
            <ThemeProvider theme={mainTheme}>
                { !isLoading && <div className="App">
                    <RouterProvider router={router} />
                </div> }
            </ThemeProvider>
        </GoogleOAuthProvider>
    );
}

export default App;