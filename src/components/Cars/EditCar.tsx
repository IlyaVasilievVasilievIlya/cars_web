import { yupResolver } from '@hookform/resolvers/yup';
import { Button, CircularProgress, Dialog, DialogActions, DialogContent, MenuItem, TextField } from '@mui/material';
import { useEffect } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { editCarSchema } from '../../common/schemes';
import { brandModelsStore } from '../../store/brandModelsStore';
import { carsStore } from '../../store/carsStore';
import { ErrorSnack } from '../ErrorSnack';
import { Car, EditCarRequest } from '../model';
import { DialogHeader } from '../ui-kit/DialogHeader';

interface EditCarProps {
    car: Car
    isModalOpen: boolean
    onClose: () => void
}

export const EditCar: React.FC<EditCarProps> = ({ car, isModalOpen, onClose }: EditCarProps) => {
    
    const { handleSubmit, formState: { errors }, reset, control } = useForm<EditCarRequest>({
        defaultValues: { carId: car.carId, color: car.color ?? undefined, carModelId: car.brand.carModelId },
        resolver: yupResolver(editCarSchema)
    });

    useEffect(() => {
        reset({ carId: car.carId, color: car.color ?? undefined, carModelId: car.brand.carModelId });
    }, [reset, car])


    let brandModelList = brandModelsStore.brandModels.map(model =>
        <MenuItem key={model.carModelId} value={model.carModelId}>
            {model.brand} {model.model}
        </MenuItem>);

    const editCar = async (editedCar: EditCarRequest) => {
        const brandModel = brandModelsStore.brandModels.find(elem => elem.carModelId === editedCar.carModelId);

        if (!brandModel) {
            carsStore.setActionError('car model not found');
            return;
        }

        await carsStore.editCar({ ...editedCar, brand: brandModel });

        if (!carsStore.actionError) {
            closeForm();
            return;
        }
    }

    const closeForm = () => {
        carsStore.setActionError();
        reset();
        onClose();
    }

    const enterSubmit = (e: React.KeyboardEvent<HTMLDivElement>) => {
        if (e.code === 'Enter') {
            handleSubmit(editCar)();
        }
    }

    return (
        <>
        <Dialog
            open={isModalOpen}
            onSubmit={handleSubmit(editCar)}
            onClose={closeForm}>
            <DialogHeader text="Редактирование машины" closeForm={closeForm} />
            <DialogContent style={{ display: 'flex', flexDirection: 'column', gap: 20, paddingTop: 10, minWidth: '400px' }}>
                <Controller
                    control={control}
                    name="carModelId"
                    render={({ field: { onChange, value } }) => (
                        <TextField
                            select
                            label="Модель"
                            fullWidth
                            placeholder='Выберите модель машины'
                            value={value}
                            onKeyUp={enterSubmit}
                            onChange={onChange}>
                            {brandModelList}
                        </TextField>)} />
                <Controller
                    control={control}
                    name="color"
                    render={({ field: { onChange, value } }) => (
                        <TextField
                            label="Цвет"
                            type="text"
                            fullWidth
                            autoComplete='off'
                            value={value ?? ''}
                            onKeyUp={enterSubmit}
                            onChange={onChange} sx={{ minHeight: '80px' }}
                            placeholder='Введите цвет машины'
                            helperText={errors.color?.message?.toString()}
                        />)}
                />
            </DialogContent>
            <DialogActions>
                <Button 
                    type="submit" 
                    onClick={handleSubmit(editCar)} 
                    disabled={carsStore.loading}>
                        {carsStore.loading ? <CircularProgress size={20} /> : 'Сохранить'}
                </Button>
                <Button type="reset" onClick={closeForm}>Закрыть</Button>
            </DialogActions>
            {carsStore.actionError && <ErrorSnack error={carsStore.actionError} />}
        </Dialog>
        </>)
}