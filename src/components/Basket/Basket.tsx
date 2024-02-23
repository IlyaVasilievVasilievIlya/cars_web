import React, { useEffect, useState } from 'react';

import { Close } from '@mui/icons-material';
import { Box, Button, Drawer, List, Typography } from '@mui/material';
import { observer } from 'mobx-react-lite';
import { basketStore } from '../../store/basketStore';
import '../styles.css';
import { BasketListItem } from './BasketListItem';

interface BasketProps {
    onClose: () => void
    isModalOpen: boolean;
}

export const Basket: React.FC<BasketProps> = observer(({ isModalOpen, onClose }: BasketProps) => {

    const [isOpen, setIsOpen] = useState(isModalOpen);

    useEffect(() => {
        setIsOpen(isModalOpen);
    }, [isModalOpen])

    const clear = () => {
        basketStore.clear();
    }

    const closeBasket = () => {
        setIsOpen(false);
        onClose();
    }

    return (
        <Drawer
            anchor="right"
            open={isOpen}
            onClose={closeBasket}>
            <Box display={"flex"} justifyContent={"space-between"}>
                {basketStore.basket.length < 1 && <Typography minWidth={'20%'} p={5} fontSize={20}>
                    Корзина пуста
                </Typography>}
                {basketStore.basket.length > 0 && <Button onClick={clear}>
                    Очистить
                </Button>}
                <Button onClick={closeBasket}>
                    <Close />
                </Button>
            </Box>
            <List>
                {basketStore.basket.map(item =>
                    <BasketListItem
                        count={item.count}
                        id={item.id}
                        key={item.id}
                        name={item.name} />)}
            </List>
        </Drawer>
    );
});