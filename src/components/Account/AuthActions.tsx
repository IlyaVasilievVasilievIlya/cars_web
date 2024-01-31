import React from 'react';
import { NavLink } from 'react-router-dom';
import { authStore } from '../../store/authStore';


export const AuthActions: React.FC = () => {

    return (
        authStore.authData ? (
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
    );
}