import React from 'react';
import './styles.css';
import { NavLink } from 'react-router-dom';
import { navInfos } from '../public/consts';
import { AppBar, Button, Menu, MenuItem, Toolbar, Typography } from '@mui/material';

interface Props {
  children?: React.ReactNode;
}

export const Header: React.FC<Props> = ({ children }: Props) => {

  const navMenu = navInfos.map(link =>
      <NavLink to={link.path} key={link.path}>
        {link.text}
      </NavLink>);

  return (
    <AppBar position="static">
      <Toolbar>
        <Typography>
          Cars Project
        </Typography>
        {navMenu}
        {children}
      </Toolbar>
    </AppBar>
  );
}