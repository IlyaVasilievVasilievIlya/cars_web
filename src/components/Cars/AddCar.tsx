import { Car, AddCarRequest } from '../model'
import { useEffect, useState } from 'react'
import { Controller, useForm } from 'react-hook-form';
import { Button, CircularProgress, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, IconButton, MenuItem, Select, TextField, Typography } from '@mui/material';
import { brandModelsStore } from '../../store/brandModelsStore';
import { object, string, number } from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import { carsStore } from '../../store/carsStore';
import { ErrorSnack } from '../ErrorSnack';
import { authStore } from '../../store/authStore';
import { useNavigate } from 'react-router-dom';
import { Close } from '@mui/icons-material';
import { DialogHeader } from '../ui-kit/DialogHeader';


export const AddCar: React.FC = () => {

    const navigate = useNavigate();

    const schema = object({
        carModelId: number().required('Это обязательное поле'),
        color: string().max(128, 'Поле не должно содержать более 128 символов')
    })

    const { handleSubmit, formState: { errors }, reset, control } = useForm<AddCarRequest>({
        resolver: yupResolver(schema)
    });

    const [modal, setModal] = useState(false);

    let brandModelList = brandModelsStore.brandModels.map(model =>
        <MenuItem key={model.carModelId} value={model.carModelId}>
            {model.brand} {model.model}
        </MenuItem>);

    const createCar = async (newCar: AddCarRequest) => {


        const brandModel = brandModelsStore.brandModels.find(elem => elem.carModelId === newCar.carModelId);

        if (!brandModel) {
            carsStore.setActionError('car model not found');
            return;
        }

        await carsStore.addCar({ ...newCar, brand: brandModel, carId: 0 });

        if (!carsStore.actionError) {
            closeForm();
            return;
        }

        if (authStore.errorCode === 401) {
            navigate("/login");
        }
    }

    const closeForm = () => {
        setModal(false);
        reset();
    }

    return (
        <>
            <Button type="button" onClick={() => setModal(true)}>
                Добавить
            </Button>
            <Dialog
                open={modal}
                onSubmit={handleSubmit(createCar)}
                onClose={closeForm}>
                <DialogHeader text="Добавление машины" closeForm={closeForm}/>
                <DialogContent style={{ display: 'flex', gap: 10, paddingTop: 10, alignItems: 'flex-start' }} >
                    <Controller
                        control={control}
                        name="carModelId"
                        defaultValue={1}
                        render={({ field }) => (
                            <Select labelId="Модель машины"
                                label="Модель машины" {...field}
                                placeholder='Выберите модель машины'
                                fullWidth sx={{ minHeight: '56px', minWidth: "250px" }}
                                variant="standard" >
                                {brandModelList}
                            </Select>)

                        } />
                    <Controller
                        control={control}
                        name="color"
                        defaultValue=''
                        render={({ field: { onChange, value } }) => (
                            <TextField
                                label="Цвет"
                                type="text"
                                fullWidth
                                value={value}
                                onChange={onChange} sx={{ minHeight: '100px', minWidth: "250px" }}
                                placeholder='Введите цвет машины'
                                helperText={errors.color?.message?.toString()
                                }
                            />)}
                    />
                </DialogContent>
                <DialogActions>
                    <Button type="submit" onClick={handleSubmit(createCar)}>{carsStore.loading ? <CircularProgress /> : 'Добавить'}</Button>
                    <Button type="reset" onClick={closeForm}>Закрыть</Button>
                </DialogActions>
            </Dialog>
            {carsStore.actionError && <ErrorSnack error={carsStore.actionError} />}
        </>
    )
}