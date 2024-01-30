import { Button, CircularProgress, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, IconButton, Typography } from '@mui/material';
import { useState } from 'react';
import { Car } from '../model';
import { carsStore } from '../../store/carsStore';
import { ErrorSnack } from '../ErrorSnack';
import { authStore } from '../../store/authStore';
import { useNavigate } from 'react-router-dom';
import { Close } from '@mui/icons-material';
import { DialogHeader } from '../ui-kit/DialogHeader';

interface DeleteCarProps {
    car: Car
    onDone: () => void
}

export const DeleteCar: React.FC<DeleteCarProps> = ({ car, onDone }: DeleteCarProps) => {

    const navigate = useNavigate();

    const deleteCar = async () => {
        
        await carsStore.deleteCar(car.carId);

        if (!carsStore.actionError) {
            closeForm();
            return;
        }

        if (authStore.errorCode === 401) {
            navigate("/login");
        }
    }

    const closeForm = () => {
        onDone();
    }

    return (
      <Dialog
        open={true}
        onSubmit={() => deleteCar()}
        onClose={() => closeForm()}>
        <DialogHeader text="Удаление машины" closeForm={closeForm}/>
        <DialogTitle sx={{display: 'flex', justifyContent: 'space-between'}}>
          Удаление машины
            <IconButton onClick={closeForm} >
              <Close />
            </IconButton>
        </DialogTitle>
        <DialogContent>
          <DialogContentText>
            Вы уверены, что хотите удалить машину "{`${car.brand.brand} ${car.brand.model}`}"?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button type="submit" onClick={deleteCar}>{carsStore.loading ? <CircularProgress/> : 'Да'}</Button>
          <Button type="reset" onClick={closeForm}>Нет</Button>
        </DialogActions>
            {carsStore.actionError && <ErrorSnack error={carsStore.actionError}/>}
      </Dialog>
    );
}