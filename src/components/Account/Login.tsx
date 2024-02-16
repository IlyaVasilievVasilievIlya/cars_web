import { yupResolver } from '@hookform/resolvers/yup';
import { Box, Button, CircularProgress, Container, Grid, TextField, Typography } from "@mui/material";
import { CredentialResponse, GoogleLogin } from "@react-oauth/google";
import { useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { Navigate, useLocation } from "react-router-dom";
import { ROUTES } from '../../common/routes';
import { loginSchema } from '../../common/schemes';
import { authStore } from '../../store/authStore';
import { ErrorSnack } from "../ErrorSnack";
import { Header } from "../Header";
import { LoginRequest } from '../model';

export const Login: React.FC = () => {

    const location = useLocation();

    let fromPage = location.state?.from?.pathname;
    if (!fromPage || fromPage === ROUTES.Logout) {
        fromPage = ROUTES.Home;
    }

    useEffect(() => {
        return () => authStore.setError(undefined)
    }, []);

    const [login, setLogin] = useState(false);

    const { handleSubmit, formState: { errors }, control } = useForm({
        resolver: yupResolver(loginSchema)
    });

    const tryGoogleLogin = async (response: CredentialResponse) => {
        if (!response.credential) {
            return;
        }

        await authStore.loginWithGoogle(response.credential);
        if (!authStore.error) {
            setLogin(true)
        }
    }

    const tryLogin = async (request: LoginRequest) => {
        await authStore.login(request);

        if (!authStore.error) {
            setLogin(true);
        }
    }

    return (
        <>
            <Header />
            {login && <Navigate to={fromPage} replace={true} />}
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
                    Войти
                </Typography>
                <Box component="form" noValidate onSubmit={handleSubmit(tryLogin)} sx={{ p: "40px", display: "flex", flexDirection: "column" }}>
                    <Grid container rowSpacing={3} columnSpacing={2}>
                        <Grid item xs={12} height={"90px"}>
                            <Controller
                                control={control}
                                name="email"
                                render={({ field: { onChange, value } }) => (
                                    <TextField
                                        label="Email"
                                        required
                                        fullWidth
                                        placeholder='Введите email'
                                        value={value ?? ''}
                                        onChange={onChange}
                                        helperText={errors.email?.message?.toString()}
                                    >
                                    </TextField>)} />
                        </Grid>
                        <Grid item xs={12} height={"90px"}>
                            <Controller
                                control={control}
                                name="password"
                                render={({ field: { onChange, value } }) => (
                                    <TextField
                                        label="Пароль"
                                        required
                                        fullWidth
                                        type="password"
                                        value={value ?? ''}
                                        onChange={onChange}
                                        placeholder='Введите пароль'
                                        helperText={errors.password?.message?.toString()} />)} />
                        </Grid>
                    </Grid>
                </Box>
                <Box display={"flex"} flexDirection={"column"}>
                    <Button type="submit" onClick={handleSubmit(tryLogin)} sx={{ height: "50px" }}>{authStore.loading ? <CircularProgress /> : 'Войти'}</Button>
                    <GoogleLogin type="icon"
                        onSuccess={tryGoogleLogin} />
                </Box>
            </Container>
            {authStore.error && <ErrorSnack error={authStore.error} />}
        </>
    )
}