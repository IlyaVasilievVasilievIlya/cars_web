import { Button, CircularProgress, Dialog, DialogActions, DialogContent, DialogContentText } from '@mui/material';
import { useEffect, useState } from 'react';
import { carsStore } from '../../store/carsStore';
import { LogoutIfExpired } from '../Account/LogoutIfExpired';
import { ErrorSnack } from '../ErrorSnack';
import { Car } from '../model';
import { DialogHeader } from '../ui-kit/DialogHeader';

interface DeleteCarProps {
    car: Car
    isModalOpen: boolean
    onClose: () => void
}

export const DeleteCar: React.FC<DeleteCarProps> = ({ car, isModalOpen, onClose }: DeleteCarProps) => {

    const [isOpen, setIsOpen] = useState(isModalOpen);

    useEffect(() => {
        setIsOpen(isModalOpen);
    }, [isModalOpen])


    const deleteCar = async () => {
        await carsStore.deleteCar(car.carId);

        if (!carsStore.actionError) {
            closeForm();
            return;
        }
    }

    const closeForm = () => {
        carsStore.setActionError();
        setIsOpen(false);
        onClose();
    }

    return (
        <>
            <LogoutIfExpired/>
            <Dialog
                open={isOpen}
                onSubmit={() => deleteCar()}
                onClose={() => closeForm()}>
                <DialogHeader text="Удаление машины" closeForm={closeForm} />
                <DialogContent>
                    <DialogContentText>
                        Вы уверены, что хотите удалить машину "{`${car.brand.brand} ${car.brand.model}`}"?
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button type="submit" onClick={deleteCar}>{carsStore.loading ? <CircularProgress size={20} /> : 'Да'}</Button>
                    <Button type="reset" onClick={closeForm}>Нет</Button>
                </DialogActions>
                {carsStore.actionError && <ErrorSnack error={carsStore.actionError} />}
            </Dialog>    
        </>
    );
}