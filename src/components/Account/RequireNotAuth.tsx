import { Navigate, Outlet } from 'react-router-dom';
import { ROUTES } from '../../common/routes';
import { authStore } from '../../store/authStore';


export const RequireNotAuth = () => {

    return authStore.User ? <Navigate to={ROUTES.Home} replace={true} /> : <Outlet />;
}