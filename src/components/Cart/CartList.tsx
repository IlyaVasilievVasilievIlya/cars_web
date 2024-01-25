import React, { useState, useEffect } from 'react';

import '../styles.css';
import { EditCart } from './EditCart';
import { ErrorMessage } from '../ErrorMessage';
import { observer } from 'mobx-react-lite';
import { carsStore } from '../../store/carsStore';
import { Cart } from '../model';
import { AddCart } from './AddCart';
import { Button, Cartd, CartdActions, CartdContent, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, IconButton, List, ListItem, ListItemText, Typography } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete'
import EditIcon from '@mui/icons-material/Edit'
import { authStore } from '../../store/authStore';
import { ROLES } from '../../public/consts';
import { DeleteCart } from './DeleteCart';
import { useNavigate } from 'react-router-dom';

export const CartList: React.FC = observer(() => {

  const [car, setCart] = useState<Cart>({ carId: 0, brand: { carModelId: 0, brand: '', model: '' } });

  const [isOpenEditModal, setIsOpenEditModal] = useState(false);

  const [isOpenDeleteModal, setIsOpenDeleteModal] = useState(false);

  const navigate = useNavigate();

  if (authStore.errorCode == 401){
    navigate("/login");
  }

  function openDeleteModal(id: number) {
    const selectedCart = carsStore.cars.find(el => el.carId == id);

    if (selectedCart) {
      setCart(selectedCart);
      setIsOpenDeleteModal(true);
    }
  }

  function openEditModal(id: number) {
    const selectedCart = carsStore.cars.find(el => el.carId == id);

    if (selectedCart) {
      setCart(selectedCart);
      setIsOpenEditModal(true);
    }
  }


  let carList = carsStore.cars.map(carElem =>
    <Cartd key={carElem.carId}>
      <CartdContent>
        <Typography>
          {carElem.brand.brand} {carElem.brand.model}
        </Typography>
        <Typography>
          {carElem.color}
        </Typography>
        { authStore.checkRole([ROLES.Manager, ROLES.Admin, ROLES.SuperUser]) &&
          <CartdActions disableSpacing={true}>
            <IconButton onClick={() => openEditModal(carElem.carId)}>
              <EditIcon />
            </IconButton>
            <IconButton onClick={() => openDeleteModal(carElem.carId)}>
              <DeleteIcon />
            </IconButton>
          </CartdActions> }
      </CartdContent>
    </Cartd>);


  useEffect(() => {
    carsStore.fetchCarts();
  }, [])


  return (
    <>
      {carsStore.fetchError && <ErrorMessage error={carsStore.fetchError} />}

      {authStore.checkRole([ROLES.Manager, ROLES.Admin, ROLES.SuperUser]) && <AddCart />}

      {!carsStore.fetchError && <List>
        {carList}
      </List>}

      {isOpenDeleteModal && <DeleteCart car={car} onDone={() => setIsOpenDeleteModal(false)} />}


      {isOpenEditModal && <EditCart car={car} onDone={() => setIsOpenEditModal(false)} />}
    </>
  );
});