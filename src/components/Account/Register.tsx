import { yupResolver } from "@hookform/resolvers/yup";
import { Box, Button, CircularProgress, Container, Grid, TextField, Typography } from "@mui/material";
import { LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DateField } from '@mui/x-date-pickers/DateField';
import { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { ROUTES } from "../../common/routes";
import { registerSchema } from "../../common/schemes";
import { authStore } from "../../store/authStore";
import { ErrorSnack } from "../ErrorSnack";
import { Header } from "../Header";
import { RegisterRequest } from "../model";

export const Register: React.FC = () => {

    const navigate = useNavigate();

    const { handleSubmit, formState: { errors }, control } = useForm({
        resolver: yupResolver(registerSchema)
    });
    
    const [error, setError] = useState<string | undefined>();
    
    const tryRegister = async (request: RegisterRequest) => {
        
        await authStore.register(request);
        
        if (!authStore.error) {
            navigate(ROUTES.Home);
        } else {
            setError(authStore.error);
        }
    }

    const enterSubmit = (e: React.KeyboardEvent<HTMLDivElement>) => {
        if (e.code === 'Enter') {
            handleSubmit(tryRegister)();
        }
    }

    return (
        <>
            <Header />
            <Container component="main" maxWidth="sm" sx={{
                padding: 4,
                mt: 3,
                display: "flex",
                flexDirection: "column",
                gap: "10px",
                border: "var(--border-style)",
                boxShadow: "0px 0px 12px -2px",
                borderRadius: 2
            }} >
                <Typography component={"h1"} variant={"h5"}>
                    Регистрация
                </Typography>
                <Box component="form" onSubmit={handleSubmit(tryRegister)}>
                    <Grid container rowSpacing={3} columnSpacing={2}>
                        <Grid item xs={12} height={"100px"}>
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
                                        onKeyUp={enterSubmit}
                                        helperText={errors.email?.message?.toString()}
                                    >
                                    </TextField>)} />
                        </Grid>
                        <Grid item xs={12} height={"100px"}>
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
                                        onKeyUp={enterSubmit}
                                        placeholder='Введите пароль'
                                        helperText={errors.password?.message?.toString()} />)} />
                        </Grid>
                        <Grid item xs={12} height={"100px"}>
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
                                        onKeyUp={enterSubmit}
                                        placeholder='Введите пароль'
                                        helperText={errors.confirmPassword?.message?.toString()} />)} />
                        </Grid>
                        <Grid item xs={12} sm={6} height={"100px"}>
                            <Controller
                                control={control}
                                name="name"
                                render={({ field: { onChange, value } }) => (
                                    <TextField
                                        label="Имя"
                                        required
                                        fullWidth
                                        value={value ?? ''}
                                        onChange={onChange}
                                        onKeyUp={enterSubmit}
                                        placeholder='Введите имя'
                                        helperText={errors.name?.message?.toString()} />)} />
                        </Grid>
                        <Grid item xs={12} sm={6} height={"100px"}>
                            <Controller
                                control={control}
                                name="surname"
                                render={({ field: { onChange, value } }) => (
                                    <TextField
                                        label="Фамилия"
                                        required
                                        fullWidth
                                        value={value ?? ''}
                                        onChange={onChange}
                                        onKeyUp={enterSubmit}
                                        placeholder='Введите фамилию'
                                        helperText={errors.surname?.message?.toString()} />)} />
                        </Grid>
                        <Grid item xs={12} sm={6} height={"100px"}>
                            <Controller
                                control={control}
                                name="patronymic"
                                render={({ field: { onChange, value } }) => (
                                    <TextField
                                        label="Отчество"
                                        fullWidth
                                        value={value ?? ''}
                                        onChange={onChange}
                                        onKeyUp={enterSubmit}
                                        placeholder='Введите отчество'
                                        helperText={errors.patronymic?.message?.toString()}
                                    />)} />
                        </Grid>
                        <Grid item xs={12} sm={6} height={"100px"}>
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
                                            onKeyUp={enterSubmit}
                                            helperText={errors.birthDate?.message?.toString()}
                                            format="DD-MM-YYYY"
                                        />
                                    </LocalizationProvider>
                                )} />
                        </Grid>
                    </Grid>
                </Box>
                <Box display={"flex"} flexDirection={"column"} sx={{ height: "50px" }}>
                    <Button 
                        type="submit" 
                        onClick={handleSubmit(tryRegister)} 
                        disabled={authStore.loading}>
                            {authStore.loading ? <CircularProgress /> : 'Зарегистрироваться'}
                    </Button>
                </Box>
            </Container>
            {error && <ErrorSnack error={error} />}
        </>
    )
}