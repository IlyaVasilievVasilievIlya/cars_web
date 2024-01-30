import { BrandModel, Car, EditCarRequest } from '../model'
import { Controller, SubmitHandler, useForm } from 'react-hook-form';
import Select from 'react-select';
import { Button, CircularProgress, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, IconButton, TextField, Typography } from '@mui/material';
import { useEffect, useState } from 'react';
import { brandModelsStore } from '../../store/brandModelsStore';
import { MenuItem } from '@mui/material';
import { number, object, string } from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import { carsStore } from '../../store/carsStore';
import { ErrorSnack } from '../ErrorSnack';
import { authStore } from '../../store/authStore';
import { useNavigate } from 'react-router-dom';
import { Close } from '@mui/icons-material';
import { DialogHeader } from '../ui-kit/DialogHeader';

interface EditCarProps {
    car: Car
    onDone: () => void
}

export const EditCar: React.FC<EditCarProps> = ({ car, onDone }: EditCarProps) => {

    const schema = object({
        carModelId: number().required('Это обязательное поле'),
        color: string().max(128, 'Поле не должно содержать более 128 символов'),
        carId: number().required()
    })

    const { handleSubmit, formState: { errors }, reset, control } = useForm<EditCarRequest>(
        {
            defaultValues: { ...car, carModelId: car.brand.carModelId },
            resolver: yupResolver(schema)
        });

    const navigate = useNavigate();

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

        if (authStore.errorCode === 401){
            navigate("/login");
        }
    }

    const closeForm = () => {
        reset();
        onDone();
    }

    return (
        <Dialog
            open={true}
            onSubmit={handleSubmit(editCar)}
            onClose={closeForm}>
            <DialogHeader text="Редактирование машины" closeForm={closeForm}/>
            <DialogContent style={{display:'flex', gap: 10, paddingTop: 10}}>
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
                            value={value}
                            onChange={onChange}
                            placeholder='Введите цвет машины'
                            helperText={errors.color?.message?.toString()}
                        />)}
                />
            </DialogContent>
            <DialogActions>
                <Button type="submit" onClick={handleSubmit(editCar)}>{carsStore.loading ? <CircularProgress/> : 'Сохранить'}</Button>
                <Button type="reset" onClick={closeForm}>Закрыть</Button>
            </DialogActions>
            {carsStore.actionError && <ErrorSnack error={carsStore.actionError} />}
        </Dialog>)
}