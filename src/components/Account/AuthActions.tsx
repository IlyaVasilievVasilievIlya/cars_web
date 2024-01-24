import React from 'react';
import { NavLink } from 'react-router-dom';
import { navInfos } from '../../public/consts';
import { AppBar, Toolbar, Typography } from '@mui/material';
import { authStore } from '../../store/authStore';


export const AuthActions: React.FC = () => {


    const navMenu =
        authStore.authData ?
            (
                <NavLink to="/logout" key="/logout">
                    Logout
                </NavLink>)
            : (
                <>
                    <NavLink to="/login" key="/login">
                        Login
                    </NavLink>
                    <NavLink to="/register" key="register">
                        Register
                    </NavLink>
                </>
            )
    return (
        navMenu
    );
}