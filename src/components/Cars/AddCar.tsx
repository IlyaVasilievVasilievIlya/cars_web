import { yupResolver } from '@hookform/resolvers/yup';
import { Button, CircularProgress, Dialog, DialogActions, DialogContent, MenuItem, Select, TextField } from '@mui/material';
import { useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { brandModelsStore } from '../../store/brandModelsStore';
import { carsStore } from '../../store/carsStore';
import { ErrorSnack } from '../ErrorSnack';
import { AddCarRequest } from '../model';
import { DialogHeader } from '../ui-kit/DialogHeader';
import { addCarSchema } from '../../common/schemes';

export const AddCar: React.FC = () => {


    const [modal, setModal] = useState(false);

    const { handleSubmit, formState: { errors }, reset, control } = useForm<AddCarRequest>({
        resolver: yupResolver(addCarSchema)
    });

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
    }

    const closeForm = () => {
        carsStore.setActionError();
        setModal(false);
        reset();
    }

    const enterSubmit = (e: React.KeyboardEvent<HTMLDivElement>) => {
        if (e.code === 'Enter') {
            handleSubmit(createCar)();
        }
    }

    return (
        <>
            <Button type="button" onClick={() => setModal(true)}>
                Добавить
            </Button>
            <Dialog
                open={modal}
                onSubmit={handleSubmit(createCar)}
                onClose={closeForm}
                onKeyUp={e => {
                    if (e.key === 'Enter') {
                        handleSubmit(createCar);
                    }
                }}>
                <DialogHeader text="Добавление машины" closeForm={closeForm} />
                <DialogContent style={{
                    display: 'flex',
                    flexDirection: 'column',
                    gap: 20,
                    paddingTop: 10, minWidth: '400px'
                }}>
                    <Controller
                        control={control}
                        name="carModelId"
                        defaultValue={1}
                        render={({ field }) => (
                            <Select labelId="Модель машины"
                                label="Модель машины" {...field}
                                placeholder='Выберите модель машины'
                                fullWidth sx={{ minHeight: '56px' }}
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
                                autoComplete='off'
                                value={value}
                                onChange={onChange} sx={{ minHeight: '80px' }}
                                onKeyUp={enterSubmit}
                                placeholder='Введите цвет машины'
                                helperText={errors.color?.message?.toString()
                                }
                            />)}
                    />
                </DialogContent>
                <DialogActions>
                    <Button
                        type="submit" 
                        onClick={handleSubmit(createCar)} 
                        disabled={carsStore.loading}>
                            {carsStore.loading ? <CircularProgress size={20} /> : 'Добавить'}
                    </Button>
                    <Button type="reset" onClick={closeForm}>Закрыть</Button>
                </DialogActions>
            </Dialog>
            {carsStore.actionError && <ErrorSnack error={carsStore.actionError} />}
        </>
    )
}