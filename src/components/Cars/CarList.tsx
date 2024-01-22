import React, { useState, useEffect } from 'react';

import '../styles.css';
import { EditCar } from './EditCar';
import { ErrorMessage } from '../ErrorMessage';
import { observer } from 'mobx-react-lite';
import { carsStore } from '../../store/carsStore';
import { Car } from '../model';
import { AddCar } from './AddCar';
import { Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, IconButton, List, ListItem, ListItemText } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete'
import EditIcon from '@mui/icons-material/Edit'

export const CarList: React.FC = observer(() => {

  const [car, setCar] = useState<Car>({ carId: 0, brand: { carModelId: 0, brand: '', model: '' } });

  const [isOpenEditModal, setIsOpenEditModal] = useState(false);

  const [isOpenDeleteModal, setIsOpenDeleteModal] = useState(false);

  const [error, setError] = useState<string | undefined>();

  const deleteCar = async () => {

    await carsStore.deleteCar(car.carId);

    if (!carsStore.error) {
      setError(carsStore.error)
    }

    setIsOpenDeleteModal(false);
  }

  const editCar = async (editedCar: Car) => {
    await carsStore.editCar(editedCar);

    console.log(carsStore.cars);

    if (!carsStore.error) {
      setError(carsStore.error);
    }
  }

  const addCar = async (newCar: Car) => {
    await carsStore.addCar(newCar);
  }

  function openDeleteModal(id: number) {
    const selectedCar = carsStore.cars.find(el => el.carId == id);

    if (selectedCar) {
      setCar(selectedCar);
      setIsOpenDeleteModal(true);
    }
  }

  function openEditModal(id: number) {
    const selectedCar = carsStore.cars.find(el => el.carId == id);

    if (selectedCar) {
      setCar(selectedCar);
      setIsOpenEditModal(true);
    }
  }


  let carList = carsStore.cars.map(carElem =>
    <ListItem key={carElem.carId}
      secondaryAction={
        <>
          <IconButton onClick={() => openEditModal(carElem.carId)}>
            <EditIcon />
          </IconButton>
          <IconButton onClick={() => openDeleteModal(carElem.carId)}>
            <DeleteIcon />
          </IconButton>
        </>
      }>
      <ListItemText
        primary={`${carElem.brand.brand} ${carElem.brand.model}`}
        secondary={carElem.color}
      >
      </ListItemText>
    </ListItem>);


  useEffect(() => {
    carsStore.fetchCars();
  }, [])


  return (
    <>
      {error && <ErrorMessage error={error}/>}
      
      {/* {loading && <Loader />} */}

      <AddCar onAdd={addCar}/>

      {!carsStore.error && <List>
        {carList}
      </List>}

      <Dialog 
        open={isOpenDeleteModal}
        onSubmit={() => deleteCar()}
        onClose={() => setIsOpenDeleteModal(false)}>
        <DialogTitle>Удаление машины</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Вы уверены, что хотите удалить машину "{`${car.brand.brand} ${car.brand.model}`}"?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button type="submit" onClick={() => deleteCar()}>Да</Button>
          <Button type="reset" onClick={() => setIsOpenDeleteModal(false)}>Нет</Button>
        </DialogActions>
      </Dialog>

      {isOpenEditModal && <EditCar car={car} onDone={() => setIsOpenEditModal(false)} onEdit={editCar} />}
    </>
  );
});