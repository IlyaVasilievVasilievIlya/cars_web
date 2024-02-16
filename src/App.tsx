import { CircularProgress, LinearProgress, ThemeProvider } from '@mui/material';
import React, { useEffect, useState } from 'react';
import { RouterProvider } from 'react-router-dom';
import './App.css';
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
        <ThemeProvider theme={mainTheme}>
            {isLoading ? <LinearProgress/> : <div className="App">
                <RouterProvider router={router} />
            </div>}
        </ThemeProvider>
    );
}

export default App;