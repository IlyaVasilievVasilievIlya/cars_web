import React from 'react';
import './styles.css';
import { NavLink } from 'react-router-dom';
import { navInfos } from '../public/consts';
import { AppBar, Menu, MenuItem, Toolbar, Typography } from '@mui/material';

interface Props {
  children?: React.ReactNode;
}

export const Header: React.FC<Props> = ({ children }: Props) => {

  const navMenu = navInfos.map(link =>
    <MenuItem key={link.path}>
      <NavLink to={link.path} key={link.path}>
        {link.text}
      </NavLink>
    </MenuItem>);

  return (
    <AppBar position="static">
      <Toolbar>
        <Typography>
          Cars Project
        </Typography>
        <Menu
          open={true}>
          {navMenu}
        </Menu>
        {children}
      </Toolbar>
    </AppBar>
  );
}