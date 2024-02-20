import { yupResolver } from '@hookform/resolvers/yup';
import { Box, Button, CircularProgress, Dialog, DialogActions, DialogContent, Grid, MenuItem, TextField } from '@mui/material';
import { useEffect } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { ROLES, roleList } from '../../common/roles';
import { changeRoleSchema, editUserSchema } from '../../common/schemes';
import { authStore } from '../../store/authStore';
import { usersStore } from '../../store/usersStore';
import { ErrorSnack } from '../ErrorSnack';
import { ChangeUserRoleRequest, EditUserRequest, User } from '../model';
import { DialogHeader } from '../ui-kit/DialogHeader';



interface EditUserProps {
    user?: User
    isModalOpen: boolean
    onClose: () => void
}

export const EditUser: React.FC<EditUserProps> = ({ user, onClose, isModalOpen }: EditUserProps) => {

    const { handleSubmit, formState: { errors }, reset, control } = useForm<EditUserRequest>({
        defaultValues: user,
        resolver: yupResolver(editUserSchema)
    });

    const { handleSubmit: handleRoleSubmit, reset: roleReset, control: roleControl } = useForm<ChangeUserRoleRequest>({
        defaultValues: { role: user?.role },
        resolver: yupResolver(changeRoleSchema)
    });

    useEffect(() => {
        reset(user);
        roleReset({role: user?.role})
    }, [reset, roleReset, user])

    let userRoleList = roleList.map(model =>
        <MenuItem key={model} value={model}>
            {model}
        </MenuItem>);

    const editUser = async (editedUser: EditUserRequest) => {
        if (!user) {
            return;
        }
        
        await usersStore.editUser(user.id, editedUser);

        if (!usersStore.actionError) {
            closeForm();
            return;
        }
    }

    const editRole = async (newRole: ChangeUserRoleRequest) => {
        if (!user) {
            return;
        }

        await usersStore.changeUserRole(user.id, newRole);

        if (!usersStore.actionError) {
            closeForm();
            return;
        }
    }

    const closeForm = () => {
        reset();
        roleReset();
        onClose();
    }

    return (
        <>
            <Dialog
                open={isModalOpen}
                onClose={closeForm}>
                <DialogHeader text="Редактирование данных пользователя" closeForm={closeForm} />
                <DialogContent style={{ paddingTop: "10px" }}>
                    <Grid container rowSpacing={3}>
                        <Grid item xs={12} height={"90px"}>
                            <Controller
                                control={control}
                                name="name"
                                render={({ field: { onChange, value } }) => (
                                    <TextField
                                        label="Имя"
                                        value={value}
                                        required
                                        fullWidth
                                        autoComplete='off'
                                        onChange={onChange}
                                        placeholder='Введите имя'
                                        helperText={errors.name?.message?.toString()}
                                    />)} />
                        </Grid>
                        <Grid item xs={12} height={"90px"}>
                            <Controller
                                control={control}
                                name="surname"
                                render={({ field: { onChange, value } }) => (
                                    <TextField
                                        label="Фамилия"
                                        value={value}
                                        required
                                        fullWidth
                                        autoComplete='off'
                                        onChange={onChange}
                                        placeholder='Введите фамилию'
                                        helperText={errors.surname?.message?.toString()}
                                    />)} />
                        </Grid >
                        <Grid item xs={12} height={"90px"}>
                            <Controller
                                control={control}
                                name="patronymic"
                                render={({ field: { onChange, value } }) => (
                                    <TextField
                                        label="Отчество"
                                        value={value}
                                        onChange={onChange}
                                        fullWidth
                                        autoComplete='off'
                                        placeholder='Введите отчество'
                                        helperText={errors.patronymic?.message?.toString()}
                                    />)} />
                        </Grid>
                    </Grid>
                </DialogContent>
                <DialogActions sx={{ px: 2 }}>
                    <Button type="submit" onClick={handleSubmit(editUser)}>Сохранить</Button>
                </DialogActions>
                {authStore.checkRole([ROLES.SuperUser]) &&
                    <Box>
                        <DialogContent>
                            <Controller
                                control={roleControl}
                                name="role"
                                render={({ field: { onChange, value } }) => (
                                    <TextField
                                        select
                                        label="Роль пользователя"
                                        placeholder='Выберите роль'
                                        required
                                        fullWidth
                                        value={value}
                                        onChange={onChange}>
                                        {userRoleList}
                                    </TextField>)} />
                        </DialogContent>
                        <DialogActions sx={{ px: 2 }}>
                            <Button type="submit" onClick={handleRoleSubmit(editRole)}>{usersStore.loading ? <CircularProgress size={20} /> : 'Сменить роль'}</Button>
                        </DialogActions>
                    </Box>}
                <Button type="reset" onClick={closeForm}>Закрыть</Button>
                {usersStore.actionError && <ErrorSnack error={usersStore.actionError} />}
            </Dialog>
        </>
    )
}