import { Box, Button, TextField } from "@mui/material"
import { Controller, useForm } from 'react-hook-form';
import { LoginRequest } from '../../model'
import { authStore } from '../../../store/authStore'

const EMAIL_REGEX = /^([a-zA-Z0-9._-]+@[a-zA-Z0-9._-]+\.[a-zA-Z0-9_-]+)$/;
//const PWD_REGEX = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%]).{8, 24}$/;
const PWD_REGEX = /^.{4,24}$/;


export const Login: React.FC = () => {

    const { handleSubmit, formState: { errors }, reset, control } = useForm<LoginRequest>();

    const tryLogin = (request: LoginRequest) => {

        authStore.login(request);

        //redirect + ошибки
    }
    

    return (
        <Box component="form" onSubmit={handleSubmit(tryLogin)}>          
            <Controller
                control={control}
                name="email"
                rules={{
                    required: 'Это обязательное поле', 
                    pattern: {
                        value: EMAIL_REGEX,
                        message: 'Некорректный адрес почты'
                    }}}
                render={({ field: { onChange, value } }) => (
                    <TextField
                        label="Email"
                        placeholder='Введите email'
                        value={value}
                        onChange={onChange}
                        helperText={errors.email?.message?.toString()}
                        >
                    </TextField>)} />
            <Controller
                control={control}
                name="password"
                rules={{
                    required: 'Это обязательное поле',
                    pattern: {
                        value: PWD_REGEX, 
                        message: 'Пароль должен содержать заглавные и строчные латинские символы, служебные символы и цифры'
                    }}}
                render={({ field: { onChange, value } }) => (
                    <TextField
                        label="Пароль"
                        value={value}
                        onChange={onChange}
                        placeholder='Введите пароль'
                        helperText={errors.password?.message?.toString()}
                    />)}
                    />
            <Button type="submit" onClick={handleSubmit(tryLogin)}>Добавить</Button>
            <Button type="reset">Закрыть</Button>
        </Box>
    )
}