import React, { useState, useEffect } from 'react';

import '../styles.css';
import { observer } from 'mobx-react-lite';
import { carsStore } from '../../store/carsStore';
import { Box, Button, Drawer, List, ListItem, Typography } from '@mui/material';
import { authStore } from '../../store/authStore';
import { useNavigate } from 'react-router-dom';
import { basketStore } from '../../store/basketStore';
import { BasketListItem } from './BasketListItem';
import { Close } from '@mui/icons-material';


interface BasketProps {
  onClose: () => void
}


export const Basket: React.FC<BasketProps> = observer(({ onClose }: BasketProps) => {

  const navigate = useNavigate();

  if (authStore.errorCode === 401) {
    navigate("/login");
  }

  function clear() {
    basketStore.clear();
  }

  let carList = basketStore.basket.map(item =>
    <List>
      <BasketListItem 
      
      count={item.count} 
      id={item.id} 
      key={item.id}
      name={item.name}/>
    </List>);

  return (
    <Drawer
      anchor="right"
      open={true}
      onClose={onClose}>
        <Box display={"flex"} justifyContent={"space-between"}>
          {carList.length < 1 && <Typography minWidth={'20%'} p={5} fontSize={20}>
             Корзина пуста
          </Typography>}
          { carList.length > 0 && <Button onClick={clear}>
            Очистить
          </Button>}
          <Button onClick={onClose}>
            <Close/>
          </Button>
        </Box>
        {carList}
    </Drawer>
    );
});