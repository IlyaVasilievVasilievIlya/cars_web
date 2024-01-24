import React from 'react';
import './styles.css';
import { NavLink } from 'react-router-dom';
import { navInfos } from '../public/consts';
import { AppBar, Toolbar, Typography } from '@mui/material';
import { authStore } from '../store/authStore';
import { AuthActions } from './Account/AuthActions';

interface Props {
  children?: React.ReactNode;
}

export const Header: React.FC<Props> = ({ children }: Props) => {

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

  return (
    <AppBar position="static">
      <Toolbar>
        <Typography>
          Cars Project
        </Typography>
        {navMenu}
        <AuthActions/>
      </Toolbar>
    </AppBar>
  );
}