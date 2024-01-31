import { Button, CircularProgress, Dialog, DialogActions, DialogContent, DialogContentText } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { authStore } from '../../store/authStore';
import { carsStore } from '../../store/carsStore';
import { ErrorSnack } from '../ErrorSnack';
import { Car } from '../model';
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
            navigate("/logout");
        }
    }

    const closeForm = () => {
        carsStore.setActionError();
        onDone();
    }

    return (
      <Dialog
        open={true}
        onSubmit={() => deleteCar()}
        onClose={() => closeForm()}>
        <DialogHeader text="Удаление машины" closeForm={closeForm}/>
        <DialogContent>
          <DialogContentText>
            Вы уверены, что хотите удалить машину "{`${car.brand.brand} ${car.brand.model}`}"?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button type="submit" onClick={deleteCar}>{carsStore.loading ? <CircularProgress size={20}/> : 'Да'}</Button>
          <Button type="reset" onClick={closeForm}>Нет</Button>
        </DialogActions>
            {carsStore.actionError && <ErrorSnack error={carsStore.actionError}/>}
      </Dialog>
    );
}