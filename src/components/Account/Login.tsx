import { yupResolver } from '@hookform/resolvers/yup';
import { Box, Button, CircularProgress, Container, Grid, TextField, Typography } from "@mui/material";
import { useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { Navigate } from "react-router-dom";
import { google } from '../..';
import { CLIENT_ID } from '../../common/externalAuthConfig';
import { ROUTES } from '../../common/routes';
import { loginSchema } from '../../common/schemes';
import { authStore } from '../../store/authStore';
import { ErrorSnack } from "../ErrorSnack";
import { Header } from "../Header";
import { LoginRequest } from '../model';

export const Login: React.FC = () => {

    useEffect(() => {
        google.accounts.id.initialize({
            client_id: CLIENT_ID,
            callback: tryGoogleLogin });
        google.accounts.id.renderButton(
            document.getElementById("signInDiv"),
            {theme: "outline", type: "icon"}
        );

    }, []);

    const [login, setLogin] = useState(false);

    const [error, setError] = useState<string | undefined>();

    const { handleSubmit, formState: { errors }, control } = useForm({
        resolver: yupResolver(loginSchema)
    });

    const tryGoogleLogin = async (response: any) => {
        if (!response.credential) {
            return;
        }

        await authStore.loginWithGoogle(response.credential);
        if (!authStore.error) {
            setLogin(true)
        } else {
            setError(authStore.error);
        }
    }

    const tryLogin = async (request: LoginRequest) => {
        await authStore.login(request);

        if (!authStore.error) {
            setLogin(true);
        } else {
            setError(authStore.error);
        }
    }

    return (
        <>
            <Header />
            {login && <Navigate to={ROUTES.Home} replace={true} />}
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
                    {/* <Container id="signInDiv"></Container> */}
                </Box>
            </Container>
            {error && <ErrorSnack error={error} />}
        </>
    )
}