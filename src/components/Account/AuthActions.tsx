import React from 'react';
import { NavLink } from 'react-router-dom';
import { authStore } from '../../store/authStore';
import { ROUTES } from '../../common/routes';


export const AuthActions: React.FC = () => {

    return (
        authStore.User ? (
            <NavLink to={ROUTES.Logout} key={ROUTES.Logout}>
                Logout
            </NavLink>)
            : (
                <>
                    <NavLink to={ROUTES.Login}  key={ROUTES.Login}>
                        Login
                    </NavLink>
                    <NavLink to={ROUTES.Register} key={ROUTES.Register}>
                        Register
                    </NavLink>
                </>
            )
    );
}