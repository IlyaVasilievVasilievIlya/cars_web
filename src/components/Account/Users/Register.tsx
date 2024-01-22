import { Box, Button, TextField } from "@mui/material";
import { Controller, useForm } from "react-hook-form";
import { RegisterRequest } from "../../model";
import { authStore } from "../../../store/authStore";
import { useState } from "react";
import { Navigate } from "react-router-dom";

const EMAIL_REGEX = /^([a-zA-Z0-9._-]+@[a-zA-Z0-9._-]+\.[a-zA-Z0-9_-]+)$/;
const PWD_REGEX = /^.*$/;
//const PWD_REGEX = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%]).{8, 24}$/;


//pattern: /[A-Za-z]{3}/ либо как pattern в hookform либо внутрь textfield (лучше первое)к

export const Register = () => {


    const { handleSubmit, formState: { errors }, reset, watch, control } = useForm<RegisterRequest>();

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
        {register && <Navigate to="/cars" />}
        {authStore.error}
            <Box component="form" onSubmit={handleSubmit(tryRegister)}>
                <Controller
                    control={control}
                    name="email"
                    rules={{
                        required: 'Это обязательное поле',
                        pattern: {
                            value: EMAIL_REGEX,
                            message: 'Некорректный адрес почты'
                        }
                    }}
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
                    rules={{
                        required: 'Это обязательное поле',
                        pattern: {
                            value: PWD_REGEX,
                            message: 'Пароль должен содержать заглавные и строчные латинские символы, служебные символы и цифры'
                        }
                    }}
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
                    rules={{
                        required: 'Это обязательное поле',
                        validate: (value: string) => {
                            if (watch('password') != value) {
                                return 'Пароли не совпадают';
                            }
                        }
                    }}
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
                    rules={{
                        required: 'Это обязательное поле',
                        maxLength: { value: 128, message: 'Имя не должно содержать более 128 символов' }
                    }}
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
                    rules={{
                        required: 'Это обязательное поле',
                        maxLength: { value: 128, message: 'Фамилия не должна содержать более 128 символов' }
                    }}
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
                    rules={{
                        required: false,
                        maxLength: { value: 128, message: 'Отчество не должно содержать более 128 символов' }
                    }}
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
                    rules={{
                        required: 'Это обязательное поле'
                    }}
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