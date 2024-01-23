import { BrandModel, User, EditUserRequest, UserRole, ChangeUserRoleRequest } from '../model'
import { Controller, SubmitHandler, useForm } from 'react-hook-form';
import { Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, TextField } from '@mui/material';
import { useState } from 'react';
import { MenuItem } from '@mui/material';
import { roleList } from '../../public/consts';
import { date, mixed, object, string } from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';



interface EditUserProps {
    user: User
    onEdit: (id: string, user: EditUserRequest) => void
    onRoleChange: (id: string, user: ChangeUserRoleRequest) => void
    onDone: () => void
}

export const EditUser: React.FC<EditUserProps> = ({ user, onDone, onEdit, onRoleChange }: EditUserProps) => {

    const [error, setError] = useState(false);

    const editUserSchema = object({
        name: string().required('Это обязательное поле'),
        surname: string().required('Это обязательное поле'),
        patronymic: string(),
        birthDate: date().required('Это обязательное поле')
    })

    const changeRoleSchema = object({
        role: mixed<UserRole>().required('Это обязательное поле')
    })

    const { handleSubmit, formState: { errors }, reset, control } = useForm<EditUserRequest>(
        {
            defaultValues: {name: user.name, surname: user.name, patronymic: user.patronymic, birthDate: user.birthDate},
            resolver: yupResolver(editUserSchema)
        }
    );

    const { handleSubmit: handleRoleSubmit, reset: roleReset, control: roleControl } = useForm<ChangeUserRoleRequest>(
        {
            defaultValues: { role: user.role },
            resolver: yupResolver(changeRoleSchema)
        }
    );

    let userRoleList = roleList.map(model =>
        <MenuItem key={model} value={model}>
            {model}
        </MenuItem>);

    const editUser = (editedUser: EditUserRequest) => {
        onEdit(user.id, editedUser);
        closeForm();
    }

    const editRole = (newRole: ChangeUserRoleRequest) => {
        onRoleChange(user.id, newRole);
        closeForm();
    }

    const closeForm = () => {
        reset();
        roleReset();
        onDone();
    }

    return (
        <>
            <Dialog
                open={true}
                onClose={closeForm}>
                <DialogTitle>Редактирование данных пользователя</DialogTitle>
                <DialogContent>
                    <Controller
                        control={control}
                        name="name"
                        render={({ field: { onChange, value } }) => (
                            <TextField
                                label="Имя"
                                value={value}
                                onChange={onChange}
                                placeholder='Введите имя'
                                helperText={errors.name?.message?.toString()}
                            />)} />
                    <Controller
                        control={control}
                        name="surname"
                        render={({ field: { onChange, value } }) => (
                            <TextField
                                label="Фамилия"
                                value={value}
                                onChange={onChange}
                                placeholder='Введите фамилию'
                                helperText={errors.surname?.message?.toString()}
                            />)} />
                    <Controller
                        control={control}
                        name="patronymic"
                        render={({ field: { onChange, value } }) => (
                            <TextField
                                label="Отчество"
                                value={value}
                                onChange={onChange}
                                placeholder='Введите отчество'
                                helperText={errors.patronymic?.message?.toString()}
                            />)} />
                </DialogContent>
                <DialogActions>
                    <Button type="submit" onClick={handleSubmit(editUser)}>Сохранить</Button>
                    <Button type="reset" onClick={closeForm}>Закрыть</Button>
                </DialogActions>

                <DialogContent>
                    <Controller
                        control={roleControl}
                        name="role"
                        render={({ field: { onChange, value } }) => (
                            <TextField
                                select
                                label="Роль пользователя"
                                placeholder='Выберите роль'
                                value={value}
                                onChange={onChange}>
                                {userRoleList}
                            </TextField>)} />
                    <DialogActions>
                        <Button type="submit" onClick={handleRoleSubmit(editRole)}>Сохранить</Button>
                        <Button type="reset" onClick={closeForm}>Закрыть</Button>
                    </DialogActions>
                </DialogContent>
            </Dialog>
        </>
    )
}