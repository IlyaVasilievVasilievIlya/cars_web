
import { useLocation, Navigate, Outlet } from 'react-router-dom'
import { authStore } from '../../store/authStore'

interface RequireAuthProps {
    allowedRoles: string[]
}

export const RequireAuth = ({allowedRoles}: RequireAuthProps) => {

    const location = useLocation();

    return (
        (allowedRoles.find(role => role === authStore.authData?.role)) 
            ? <Outlet/>
            : authStore.authData 
                ? <Navigate to="/unauthorized" />
                : <Navigate to="/login" state={{from: location}} replace={true}/>
    )
}