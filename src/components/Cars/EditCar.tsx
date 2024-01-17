import { BrandModel, Car, CarEditRequest } from '../model'
import { Controller, SubmitHandler, useForm } from 'react-hook-form';
import Select from 'react-select';
import { Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, TextField } from '@mui/material';
import { useEffect, useState } from 'react';
import { API_URL } from '../../public/consts';
import { brandModelsStore } from '../../store/brandModelsStore';
import { MenuItem } from '@mui/material';



interface EditCarProps {
    car: Car
    onEdit: (car: Car) => void
    onDone: () => void
}

export const EditCar: React.FC<EditCarProps> = ({car, onDone, onEdit}: EditCarProps) => {
    
    const { handleSubmit, formState: {errors}, reset, control} = useForm<CarEditRequest>(
        {defaultValues: {...car, carModelId: car.brand.carModelId}}
    );

    const [error, setError] = useState(false);


    let brandModelList = brandModelsStore.brandModels.map(model =>  
        <MenuItem key={model.carModelId} value={model.carModelId}>
            {model.brand} {model.model}
        </MenuItem>);
    
    const editCar = (editedCar: CarEditRequest) => {
        let brandModel = brandModelsStore.brandModels.find(elem => elem.carModelId == editedCar.carModelId);
        if (brandModel){
            onEdit({...editedCar, brand: brandModel});
        }
        closeForm();
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
                rules={{maxLength: {value: 128, message: 'Поле не должно содержать более 128 символов'} }}
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
            <Button type="submit" onClick={handleSubmit(editCar)}>Сохранить</Button>
            <Button type="reset" onClick={closeForm}>Закрыть</Button>
        </DialogActions>
    </Dialog>)
}