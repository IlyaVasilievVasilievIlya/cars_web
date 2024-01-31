import { User, EditUserRequest, UserRole, ChangeUserRoleRequest } from '../model'
import { Controller, useForm } from 'react-hook-form';
import { Box, Button, CircularProgress, Dialog, DialogActions, DialogContent, Grid, TextField } from '@mui/material';
import { MenuItem } from '@mui/material';
import { ROLES, roleList } from '../../public/consts';
import { date, mixed, object, string } from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import { usersStore } from '../../store/usersStore';
import { authStore } from '../../store/authStore';
import { useNavigate } from 'react-router-dom';
import { ErrorSnack } from '../ErrorSnack';
import { DialogHeader } from '../ui-kit/DialogHeader';



interface EditUserProps {
    user: User
    onDone: () => void
}

export const EditUser: React.FC<EditUserProps> = ({ user, onDone }: EditUserProps) => {

    const navigate = useNavigate();

    const editUserSchema = object({
        name: string().required('Это обязательное поле'),
        surname: string().required('Это обязательное поле'),
        patronymic: string(),
        birthDate: date().required('Это обязательное поле')
    })

    const changeRoleSchema = object({
        role: mixed<UserRole>().required('Это обязательное поле')
    })

    const { handleSubmit, formState: { errors }, reset, control } = useForm<EditUserRequest>({
        defaultValues: { name: user.name, surname: user.name, patronymic: user.patronymic, birthDate: user.birthDate },
        resolver: yupResolver(editUserSchema)
    }
    );

    const { handleSubmit: handleRoleSubmit, reset: roleReset, control: roleControl } = useForm<ChangeUserRoleRequest>({
        defaultValues: { role: user.role },
        resolver: yupResolver(changeRoleSchema)
    }
    );

    let userRoleList = roleList.map(model =>
        <MenuItem key={model} value={model}>
            {model}
        </MenuItem>);

    const editUser = async (editedUser: EditUserRequest) => {
        await usersStore.editUser(user.id, editedUser);

        if (!usersStore.actionError) {
            closeForm();
            return;
        }

        if (authStore.errorCode === 401) {
            navigate("/login");
        }
    }

    const editRole = async (newRole: ChangeUserRoleRequest) => {
        await usersStore.changeUserRole(user.id, newRole);

        if (!usersStore.actionError) {
            closeForm();
            return;
        }
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