import { yupResolver } from '@hookform/resolvers/yup';
import { Button, CircularProgress, Dialog, DialogActions, DialogContent, Input, MenuItem, Select, TextField } from '@mui/material';
import { useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { brandModelsStore } from '../../store/brandModelsStore';
import { carsStore } from '../../store/carsStore';
import { ErrorSnack } from '../ErrorSnack';
import { AddCarRequest } from '../model';
import { DialogHeader } from '../ui-kit/DialogHeader';
import { LogoutIfExpired } from '../Account/LogoutIfExpired';
import { addCarSchema } from '../../common/schemes';


export const AddCar: React.FC = () => {


    const [modal, setModal] = useState(false);

    const { handleSubmit, formState: { errors }, reset, control, register } = useForm<AddCarRequest>({
        resolver: yupResolver(addCarSchema)
    });

    let brandModelList = brandModelsStore.brandModels.map(model =>
        <MenuItem key={model.carModelId} value={model.carModelId}>
            {model.brand} {model.model}
        </MenuItem>);

    const createCar = async (newCar: AddCarRequest) => {

        await carsStore.addCar(newCar);
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

    return (
        <>
            <LogoutIfExpired />
            <Button type="button" onClick={() => setModal(true)}>
                Добавить
            </Button>
            <Dialog
                open={modal}
                onSubmit={handleSubmit(createCar)}
                onClose={closeForm}>
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
                                placeholder='Введите цвет машины'
                                helperText={errors.color?.message?.toString()
                                }
                            />)}
                    />
                    <Input
                        {...register("image")}
                        type="file" />
                </DialogContent>
                <DialogActions>
                    <Button type="submit" onClick={handleSubmit(createCar)}>{carsStore.loading ? <CircularProgress size={20} /> : 'Добавить'}</Button>
                    <Button type="reset" onClick={closeForm}>Закрыть</Button>
                </DialogActions>
            </Dialog>
            {carsStore.actionError && <ErrorSnack error={carsStore.actionError} />}
        </>
    )
}