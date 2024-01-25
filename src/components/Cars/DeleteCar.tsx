import { Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Typography } from '@mui/material';
import { useState } from 'react';
import { Car } from '../model';
import { carsStore } from '../../store/carsStore';
import { ErrorMessage } from '../ErrorMessage';
import { authStore } from '../../store/authStore';
import { useNavigate } from 'react-router-dom';

interface DeleteCarProps {
    car: Car
    onDone: () => void
}

export const DeleteCar: React.FC<DeleteCarProps> = ({ car, onDone }: DeleteCarProps) => {

    const [error, setError] = useState<string | undefined>();

    const [loading, setLoading] = useState(false);

    const navigate = useNavigate();

    const deleteCar = async () => {

        setLoading(true);
        
        await carsStore.deleteCar(car.carId);

        if (!carsStore.actionError)
        {
            closeForm();
            return;
        }

        if (authStore.errorCode == 401){
            navigate("/login");
        }

        setError(carsStore.actionError);
        setLoading(false);
    }

    const closeForm = () => {
        setLoading(false);
        setError(undefined);
        onDone();
    }

    return (
        <Dialog
        open={true}
        onSubmit={() => deleteCar()}
        onClose={() => closeForm()}>
        <DialogTitle>Удаление машины</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Вы уверены, что хотите удалить машину "{`${car.brand.brand} ${car.brand.model}`}"?
          </DialogContentText>
        </DialogContent>
        <Typography>
            {error && <ErrorMessage error={error}/>}
        </Typography>
        <DialogActions>
          <Button type="submit" onClick={deleteCar}>Да</Button>
          <Button type="reset" onClick={closeForm}>Нет</Button>
        </DialogActions>
      </Dialog>
    );
}