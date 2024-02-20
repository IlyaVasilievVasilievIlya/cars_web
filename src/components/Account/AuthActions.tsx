import React, { useState } from 'react';
import { NavLink, useLocation, useNavigate } from 'react-router-dom';
import { authStore } from '../../store/authStore';
import { ROUTES } from '../../common/routes';
import { Button, LinearProgress } from '@mui/material';

export const AuthActions: React.FC = () => {

    const navigate = useNavigate();
    const location = useLocation();
    const [loading, setLoading] = useState(false);

    const logOut = () => {
        setLoading(true);
        authStore.logOut()
            .then(() => navigate(ROUTES.Login, { state: { from: location } }))
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
                    <Button variant="text" onClick={logOut}>
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