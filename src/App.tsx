import { ThemeProvider } from '@mui/material';
import { GoogleOAuthProvider } from '@react-oauth/google';
import React, { useEffect, useState } from 'react';
import { RouterProvider } from 'react-router-dom';
import './App.css';
import { CLIENT_ID } from './common/externalAuthConfig';
import { router } from './common/routes';
import { mainTheme } from './common/themes';
import { authStore } from './store/authStore';


const App: React.FC = function () {

    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        if (!authStore.authChecked) {
            authStore.checkAuth().finally(() => setIsLoading(false));
        };
    }, [])

    return (
        <GoogleOAuthProvider clientId={CLIENT_ID}>
            <ThemeProvider theme={mainTheme}>
                {!isLoading && <div className="App">
                    <RouterProvider router={router} />
                </div>}
            </ThemeProvider>
        </GoogleOAuthProvider>
    );
}

export default App;