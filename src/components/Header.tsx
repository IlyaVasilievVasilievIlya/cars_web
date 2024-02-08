import React, { useState } from 'react';
import './styles.css';
import { NavLink } from 'react-router-dom';
import { navInfos } from '../common/consts';
import { AppBar, Box, IconButton, Toolbar, Typography } from '@mui/material';
import { authStore } from '../store/authStore';
import { AuthActions } from './Account/AuthActions';
import { ShoppingBasket } from "@mui/icons-material"
import { Basket } from './Basket/Basket';

export const Header: React.FC = () => {

    const [isBasketOpen, setIsBasketOpen] = useState(false);

    const navMenu = navInfos.map(link => {
        const elem = <NavLink to={link.path} key={link.path}>
            {link.text}
        </NavLink>;

        return (authStore.checkRole(link.allowedRoles)) ?
            elem
            : link.allowedRoles ?
                null
                : elem;
    });

    return (
        <>
            <AppBar position="static">
                <Toolbar>
                    <Typography>
                        Cars Project
                    </Typography>
                    <Box sx={{ flexGrow: 1, px: 2 }}>
                        {navMenu}
                    </Box>
                    {authStore.authData &&
                        <IconButton color='secondary' onClick={() => setIsBasketOpen(!isBasketOpen)}>
                            <ShoppingBasket />
                        </IconButton>}
                    <AuthActions />
                </Toolbar>
            </AppBar>
            {isBasketOpen && <Basket onClose={() => setIsBasketOpen(false)} />}
        </>
    );
}