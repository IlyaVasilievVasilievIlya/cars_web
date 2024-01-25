import { BrandModel, Car, EditCarRequest } from '../model'
import { Controller, SubmitHandler, useForm } from 'react-hook-form';
import Select from 'react-select';
import { Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, TextField, Typography } from '@mui/material';
import { useEffect, useState } from 'react';
import { brandModelsStore } from '../../store/brandModelsStore';
import { MenuItem } from '@mui/material';
import { number, object, string } from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import { carsStore } from '../../store/carsStore';
import { ErrorMessage } from '../ErrorMessage';
import { authStore } from '../../store/authStore';
import { useNavigate } from 'react-router-dom';



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

    const [error, setError] = useState<string | undefined>();

    const [loading, setLoading] = useState(false);

    const navigate = useNavigate();

    let brandModelList = brandModelsStore.brandModels.map(model =>
        <MenuItem key={model.carModelId} value={model.carModelId}>
            {model.brand} {model.model}
        </MenuItem>);

    const editCar = async (editedCar: EditCarRequest) => {



        setLoading(true);

        const brandModel = brandModelsStore.brandModels.find(elem => elem.carModelId == editedCar.carModelId);

        if (!brandModel) {
            setError('car model not found');
            setLoading(false);
            return;
        }

        await carsStore.editCar({ ...editedCar, brand: brandModel });

        if (!carsStore.actionError) {
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
        reset();
        onDone();
    }

    useEffect(() => {
        brandModelsStore.fetchBrandModels();
    }, [])

    return (
        <Dialog
            open={true}
            onSubmit={handleSubmit(editCar)}
            onClose={closeForm}>
            <DialogTitle>Редактирование машины</DialogTitle>
            <DialogContent>
                <Controller
                    control={control}
                    name="carModelId"
                    render={({ field: { onChange, value } }) => (
                        <TextField
                            select
                            label="Модель машины"
                            placeholder='Выберите модель машины'
                            value={value}
                            onChange={onChange}>
                            {brandModelList}
                        </TextField>)} />
                <Controller
                    control={control}
                    name="color"
                    rules={{ maxLength: { value: 128, message: 'Поле не должно содержать более 128 символов' } }}
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
                {error && <ErrorMessage error={error} />}
            </Typography>
            <DialogActions>
                <Button type="submit" onClick={handleSubmit(editCar)}>Сохранить</Button>
                <Button type="reset" onClick={closeForm}>Закрыть</Button>
            </DialogActions>
        </Dialog>)
}