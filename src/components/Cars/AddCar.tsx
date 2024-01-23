import { Car, AddCarRequest } from '../model'
import { useState } from 'react'
import { Controller, useForm } from 'react-hook-form';
import { Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, MenuItem, TextField } from '@mui/material';
import { brandModelsStore } from '../../store/brandModelsStore';
import { object, string, number } from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';


interface AddCarProps {
    onAdd: (car: Car) => void
}

export const AddCar: React.FC<AddCarProps> = ({ onAdd }: AddCarProps) => {


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

    const createCar = (newCar: AddCarRequest) => { 
        let brandModel = brandModelsStore.brandModels.find(elem => elem.carModelId == newCar.carModelId);
        if (brandModel) {
            onAdd({ ...newCar, brand: brandModel, carId: 0 })
        }

        closeForm();
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
                <DialogTitle>Добавление машины</DialogTitle>
                <DialogContent>
                    <Controller
                        control={control}
                        name="carModelId"
                        render={({ field: { onChange, value } }) => (
                            <TextField
                                select
                                label="Модель машины"
                                placeholder='Выберите модель машины'
                                value={value ?? 1}
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
                                value={value}
                                onChange={onChange}
                                placeholder='Введите цвет машины'
                                helperText={errors.color?.message?.toString()}
                            />)}
                    />
                </DialogContent>
                <DialogActions>
                    <Button type="submit" onClick={handleSubmit(createCar)}>Добавить</Button>
                    <Button type="reset" onClick={closeForm}>Закрыть</Button>
                </DialogActions>
            </Dialog>
        </>
    )
}