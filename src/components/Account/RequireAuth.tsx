
import { useLocation, Navigate, Outlet } from 'react-router-dom'
import { authStore } from '../../store/authStore'
import { ROUTES } from '../../common/routes';

interface RequireAuthProps {
    allowedRoles: string[]
}

export const RequireAuth = ({ allowedRoles }: RequireAuthProps) => {
    const location = useLocation();
    
    if (!authStore.User) {
        return <Navigate to={ROUTES.Login} state={{ from: location }} replace={true} />
    }
    if (!authStore.checkRole(allowedRoles)) {
        return <Navigate to={ROUTES.Unauthorized} />
    }
    return <Outlet />
}