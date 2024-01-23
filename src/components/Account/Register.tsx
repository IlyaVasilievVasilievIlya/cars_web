import { Box, Button, TextField } from "@mui/material";
import { Controller, useForm } from "react-hook-form";
import { RegisterRequest } from "../model";
import { authStore } from "../../store/authStore";
import { useState } from "react";
import { Navigate } from "react-router-dom";
import { date, object, ref, string } from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { Header } from "../Header";

const EMAIL_REGEX = /^([a-zA-Z0-9._-]+@[a-zA-Z0-9._-]+\.[a-zA-Z0-9_-]+)$/;
const PWD_REGEX = /^.*$/;
//const PWD_REGEX = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%]).{8, 24}$/;


//pattern: /[A-Za-z]{3}/ либо как pattern в hookform либо внутрь textfield (лучше первое)к

export const Register: React.FC = () => {

    const schema = object({
        email: string().required('Это обязательное поле').matches(EMAIL_REGEX, 'Некорректный адрес почты'),
        password: string().required('Это обязательное поле').matches(PWD_REGEX, 'Пароль должен содержать заглавные и строчные латинские символы, служебные символы и цифры'),
        confirmPassword: string().required('').oneOf([ref("password")], 'Пароли не совпадают'),
        name: string().required('Это обязательное поле').max(128, 'Имя не должно содержать более 128 символов'),
        surname: string().required('Это обязательное поле').max(128, 'Фамилия не должна содержать более 128 символов'),
        patronymic: string().max(128, 'Отчество не должно содержать более 128 символов'),
        birthDate: date().required('Это обязательное поле')
    });

    const { handleSubmit, formState: { errors }, reset, watch, control } = useForm({
        resolver: yupResolver(schema)
    });

    const [register, setRegister] = useState(false);

    const tryRegister = async (request: RegisterRequest) => {

        await authStore.register(request);

        console.log(authStore.authData);

        if (!authStore.error) {
            setRegister(true);
        }
    }

    return (
        <>
        <Header/>
        {register && <Navigate to="/cars" />}
        {authStore.error}
            <Box component="form" onSubmit={handleSubmit(tryRegister)}>
                <Controller
                    control={control}
                    name="email"
                    render={({ field: { onChange, value } }) => (
                        <TextField
                            label="Email"
                            type="email"
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
                        />)} />
                <Controller
                    control={control}
                    name="confirmPassword"
                    render={({ field: { onChange, value } }) => (
                        <TextField
                            label="Подтвердите пароль"
                            type="password"
                            value={value}
                            onChange={onChange}
                            placeholder='Введите пароль'
                            helperText={errors.confirmPassword?.message?.toString()}
                        />)} />
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
                <Controller
                    control={control}
                    name="birthDate"
                    render={({ field: { onChange, value } }) => (
                        <TextField
                            label="Дата рождения"
                            type="date"
                            value={value}
                            onChange={onChange}
                            placeholder='Введите дату рождения'
                            helperText={errors.birthDate?.message?.toString()}
                        />)} />
                <Button type="submit" onClick={handleSubmit(tryRegister)}>Добавить</Button>
                <Button type="reset">Закрыть</Button>
            </Box>
        </>
    )
}