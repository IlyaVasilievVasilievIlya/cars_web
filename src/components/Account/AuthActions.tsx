import { Button, LinearProgress } from '@mui/material';
import React, { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { ROUTES } from '../../common/routes';
import { authStore } from '../../store/authStore';

export const AuthActions: React.FC = () => {

    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);

    const logOut = () => {
        setLoading(true);
        authStore.logOut()
            .then(() => navigate(ROUTES.Login))
            .catch(_ => { })
            .finally(() => setLoading(false));
    }


    return (
        (() => {
            if (loading) {
                return <LinearProgress />
            }
            else return (
                authStore.User ? (
                    <Button variant="text" onClick={logOut} sx={{color: "var(--background-theme)", '&:hover': {color: 'white'}}  }>
                        Logout
                    </Button>)
                    : (
                        <>
                            <NavLink to={ROUTES.Login} key={ROUTES.Login}>
                                Login
                            </NavLink>
                            <NavLink to={ROUTES.Register} key={ROUTES.Register}>
                                Register
                            </NavLink>
                        </>
                    ))
        })()
    );
}