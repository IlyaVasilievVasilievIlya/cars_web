import React, { useState } from 'react';
import './styles.css';
import { NavLink } from 'react-router-dom';
import { navInfos } from '../public/consts';
import { AppBar, Box, IconButton, Toolbar, Typography } from '@mui/material';
import { authStore } from '../store/authStore';
import { AuthActions } from './Account/AuthActions';
import { ShoppingBasket } from "@mui/icons-material"
import { Basket } from './Basket/Basket';

export const Header: React.FC = () => {

  const navMenu = navInfos.map(link =>
    (authStore.checkRole(link.allowedRoles)) ?

      <NavLink to={link.path} key={link.path}>
        {link.text}
      </NavLink>
      : link.allowedRoles ?
        null
        : <NavLink to={link.path} key={link.path}>
          {link.text}
        </NavLink>);

  const [isBasketOpen, setIsBasketOpen] = useState(false);

  return (
    <>
      <AppBar position="static">
        <Toolbar>
          <Typography>
            Cars Project
          </Typography>
          <Box sx={{ flexGrow: 1, px: 2}}>
            {navMenu}
          </Box>
          {authStore.authData &&
            <IconButton color="inherit" onClick={() => setIsBasketOpen(!isBasketOpen)}>
              <ShoppingBasket />
            </IconButton>
          }
          <AuthActions />
        </Toolbar>
      </AppBar>
      {isBasketOpen && <Basket onClose={() => setIsBasketOpen(false)} />}
    </>
  );
}