import { Car, AddCarRequest } from '../model'
import { useEffect, useState } from 'react'
import { Controller, useForm } from 'react-hook-form';
import { Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, MenuItem, Select, TextField, Typography } from '@mui/material';
import { brandModelsStore } from '../../store/brandModelsStore';
import { object, string, number } from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import { carsStore } from '../../store/carsStore';
import { ErrorMessage } from '../ErrorMessage';
import { authStore } from '../../store/authStore';
import { useNavigate } from 'react-router-dom';


export const AddCar: React.FC = () => {

    const navigate = useNavigate();

    const schema = object({
        carModelId: number().required('Это обязательное поле'),
        color: string().max(128, 'Поле не должно содержать более 128 символов')
    })

    const { handleSubmit, formState: { errors }, reset, control } = useForm<AddCarRequest>({
        resolver: yupResolver(schema)
    });

    const [error, setError] = useState<string | undefined>();

    const [loading, setLoading] = useState(false);

    const [modal, setModal] = useState(false);


    let brandModelList = brandModelsStore.brandModels.map(model =>
        <MenuItem key={model.carModelId} value={model.carModelId}>
            {model.brand} {model.model}
        </MenuItem>);

    const createCar = async (newCar: AddCarRequest) => { 

        setLoading(true);

        const brandModel = brandModelsStore.brandModels.find(elem => elem.carModelId == newCar.carModelId);

        if (!brandModel) {
            setError('car model not found');
            setLoading(false);
            return;
        }
        
        await carsStore.addCar({...newCar, brand: brandModel, carId: 0});


        if (!carsStore.actionError) {
            closeForm();
            return;
        }

        if (authStore.errorCode == 401) {
            navigate("/login");
        }

        setError(carsStore.actionError);
        setLoading(false);
    }

    const closeForm = () => {
        setLoading(false);
        setError(undefined);
        setModal(false);
        reset();
    }

    useEffect( () => {
        brandModelsStore.fetchBrandModels();
    }, [])

    return (
        <>
            <Button type="button" onClick={() => setModal(true)}>
                Добавить
            </Button>
            <Dialog
                open={modal}
                onSubmit={handleSubmit(createCar)}
                onClose={closeForm}>
                <DialogTitle>Добавление машины</DialogTitle>
                <DialogContent>
                    <Controller
                        control={control}
                        name="carModelId"
                        defaultValue={1}
                        render={({ field }) => (
                            <Select labelId="Модель машины" label="Модель машины" {...field} placeholder='Выберите модель машины'>
                                {brandModelList}
                            </Select>)} />
                    <Controller
                        control={control}
                        name="color"
                        defaultValue=''
                        render={({ field: { onChange, value } }) => (
                            <TextField
                                label="Цвет"
                                type="text"
                                value={value}
                                onChange={onChange}
                                placeholder='Введите цвет машины'
                                helperText={errors.color?.message?.toString()}
                            />)}
                    />
                </DialogContent>
                <Typography>
                    {error && <ErrorMessage error={error}/>}
                </Typography>
                <DialogActions>
                    <Button type="submit" onClick={handleSubmit(createCar)}>Добавить</Button>
                    <Button type="reset" onClick={closeForm}>Закрыть</Button>
                </DialogActions>
            </Dialog>
        </>
    )
}