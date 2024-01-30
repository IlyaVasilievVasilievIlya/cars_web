import { Box, Button, Container, Grid, TextField, Typography } from "@mui/material";
import { Controller, useForm } from "react-hook-form";
import { RegisterRequest } from "../model";
import { authStore } from "../../store/authStore";
import { useState } from "react";
import { Navigate } from "react-router-dom";
import { date, object, ref, string } from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { Header } from "../Header";
import { DateField } from '@mui/x-date-pickers/DateField';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from "@mui/x-date-pickers";
import { ErrorSnack } from "../ErrorMessage";

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
        birthDate: date().typeError('').required('Это обязательное поле').min("1923-01-01", 'дата должна быть не ранее 1923.01.01').max(new Date(), `Некорректная дата`)
    });

    const { handleSubmit, formState: { errors }, control } = useForm({
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
            <Header />
            {register && <Navigate to="/cars" />}
            <Container component="main" maxWidth="sm" sx={{ 
                    padding: 4,
                    mt: 3, 
                    display: "flex", 
                    flexDirection: "column", 
                    gap: "10px", 
                    border: "var(--border-style)", 
                    boxShadow: "0px 0px 12px -2px",
                    borderRadius: 2}} >
                <Typography component={"h1"} variant={"h5"}>
                    Регистрация
                </Typography>
                <Box component="form" onSubmit={handleSubmit(tryRegister)}>
                    <Grid container rowSpacing={3} columnSpacing={2}>
                        <Grid item xs={12} height={"90px"}>
                            <Controller
                                control={control}
                                name="email"
                                render={({ field: { onChange, value } }) => (
                                    <TextField
                                        label="Email"
                                        type="email"
                                        required
                                        fullWidth
                                        placeholder='Введите email'
                                        value={value ?? ''}
                                        onChange={onChange}
                                        helperText={errors.email?.message?.toString()}
                                    >
                                    </TextField>)} />
                        </Grid>
                        <Grid item xs={12} sm={6} height={"90px"}>
                            <Controller
                                control={control}
                                name="password"
                                render={({ field: { onChange, value } }) => (
                                    <TextField
                                        label="Пароль"
                                        type="password"
                                        required
                                        fullWidth
                                        value={value ?? ''}
                                        onChange={onChange}
                                        placeholder='Введите пароль'
                                        helperText={errors.password?.message?.toString()}
                                    />)} />
                        </Grid>
                        <Grid item xs={12} sm={6} height={"90px"}>
                            <Controller
                                control={control}
                                name="confirmPassword"
                                render={({ field: { onChange, value } }) => (
                                    <TextField
                                        label="Подтвердите пароль"
                                        type="password"
                                        required
                                        fullWidth
                                        value={value ?? ''}
                                        onChange={onChange}
                                        placeholder='Введите пароль'
                                        helperText={errors.confirmPassword?.message?.toString()}
                                    />)} />
                        </Grid>
                        <Grid item xs={12} sm={6} height={"90px"}>
                            <Controller
                                control={control}
                                name="name"
                                render={({ field: { onChange, value } }) => (
                                    <TextField
                                        label="Имя"
                                        required
                                        fullWidth
                                        value={value}
                                        onChange={onChange}
                                        placeholder='Введите имя'
                                        helperText={errors.name?.message?.toString()}
                                    />)} />
                        </Grid>
                        <Grid item xs={12} sm={6} height={"90px"}>
                            <Controller
                                control={control}
                                name="surname"
                                render={({ field: { onChange, value } }) => (
                                    <TextField
                                        label="Фамилия"
                                        required
                                        fullWidth
                                        value={value}
                                        onChange={onChange}
                                        placeholder='Введите фамилию'
                                        helperText={errors.surname?.message?.toString()}
                                    />
                                )} />
                        </Grid>
                        <Grid item xs={12} sm={6} height={"90px"}>
                            <Controller
                                control={control}
                                name="patronymic"
                                render={({ field: { onChange, value } }) => (
                                    <TextField
                                        label="Отчество"
                                        fullWidth
                                        defaultValue={''}
                                        value={value}
                                        onChange={onChange}
                                        placeholder='Введите отчество'
                                        helperText={errors.patronymic?.message?.toString()}
                                    />)} />
                        </Grid>
                        <Grid item xs={12} sm={6} height={"90px"}>
                            <Controller
                                control={control}
                                name="birthDate"
                                render={({ field: { onChange, value } }) => (
                                    <LocalizationProvider dateAdapter={AdapterDayjs}>
                                        <DateField
                                            label="Дата рождения"
                                            fullWidth
                                            required
                                            value={value}
                                            onChange={onChange}
                                            helperText={errors.birthDate?.message?.toString()}
                                            format="DD-MM-YYYY"
                                        />
                                    </LocalizationProvider>
                                )} />
                        </Grid>
                    </Grid>
                </Box>
                <Box display={"flex"} flexDirection={"column"} sx={{height:"50px"}}>
                    <Button type="submit" onClick={handleSubmit(tryRegister)}>Зарегистрироваться</Button>
                </Box>
            </Container>
            {authStore.error && <ErrorSnack error={authStore.error}/>}
        </>
    )
}