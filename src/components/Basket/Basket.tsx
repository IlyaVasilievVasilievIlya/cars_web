import React from 'react';

import { Close } from '@mui/icons-material';
import { Box, Button, Drawer, List, Typography } from '@mui/material';
import { observer } from 'mobx-react-lite';
import { useNavigate } from 'react-router-dom';
import { authStore } from '../../store/authStore';
import { basketStore } from '../../store/basketStore';
import '../styles.css';
import { BasketListItem } from './BasketListItem';

interface BasketProps {
    onClose: () => void
}

export const Basket: React.FC<BasketProps> = observer(({ onClose }: BasketProps) => {

    const navigate = useNavigate();

    if (authStore.errorCode === 401) {
        navigate("/logout");
    }

    function clear() {
        basketStore.clear();
    }

    let carList = basketStore.basket.map(item =>
        <BasketListItem
            count={item.count}
            id={item.id}
            key={item.id}
            name={item.name} />
    );

    return (
        <Drawer
            anchor="right"
            open={true}
            onClose={onClose}>
            <Box display={"flex"} justifyContent={"space-between"}>
                {carList.length < 1 && <Typography minWidth={'20%'} p={5} fontSize={20}>
                    Корзина пуста
                </Typography>}
                {carList.length > 0 && <Button onClick={clear}>
                    Очистить
                </Button>}
                <Button onClick={onClose}>
                    <Close />
                </Button>
            </Box>
            <List>
                {carList}
            </List>
        </Drawer>
    );
});