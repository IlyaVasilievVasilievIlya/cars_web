import { Box, Button, TextField } from "@mui/material"
import { LoginRequest } from '../model'
import { authStore } from '../../store/authStore'
import { Navigate, useLocation, useNavigate } from "react-router-dom";
import { useState } from "react";
import { object, string } from 'yup';
import { yupResolver } from '@hookform/resolvers/yup'
import { Controller, useForm } from "react-hook-form";
import { Header } from "../Header";


const EMAIL_REGEX = /^([a-zA-Z0-9._-]+@[a-zA-Z0-9._-]+\.[a-zA-Z0-9_-]+)$/;
//const PWD_REGEX = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%]).{8, 24}$/;
const PWD_REGEX = /^.{4,24}$/;




export const Login: React.FC = () => {
    
    const location = useLocation();

    const fromPage = location.state?.from?.pathname || '/';

    const schema = object({
        email: string().required('Это обязательное поле').matches(EMAIL_REGEX, 'Некорректный адрес почты'),
        password: string().required('Это обязательное поле').matches(PWD_REGEX, 'Пароль должен содержать заглавные и строчные латинские символы, служебные символы и цифры')
    });
    
    const { handleSubmit, formState: {errors}, control } = useForm({
        resolver: yupResolver(schema)
    });

    const [login, setLogin] = useState(false);

    const tryLogin = async (request: LoginRequest) => {
        await authStore.login(request);

        console.log(authStore.authData);

        if (!authStore.error) {
            setLogin(true);
        }
    }

    return (
        <>
            <Header/>
            {login && <Navigate to={fromPage} replace={true}/>}
            {authStore.error}
            <Box component="form" onSubmit={handleSubmit(tryLogin)}>
                <Controller
                    control={control}
                    name="email"
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
                    render={({ field: { onChange, value } }) => (
                        <TextField
                            label="Пароль"
                            type="password"
                            value={value}
                            onChange={onChange}
                            placeholder='Введите пароль'
                            helperText={errors.password?.message?.toString()}
                        />)}
                />
                <Button type="submit" onClick={handleSubmit(tryLogin)}>Добавить</Button>
            </Box>
        </>
    )
}