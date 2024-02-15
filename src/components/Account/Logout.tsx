import { Navigate, useLocation } from "react-router-dom"
import { authStore } from "../../store/authStore"
import { useLayoutEffect } from "react";
import { ROUTES } from "../../common/routes";


export const Logout: React.FC = () => {
    
    const location = useLocation();

    useLayoutEffect(() => {
        await authStore.logOut();
    }, [])
    
    return <Navigate to={ROUTES.Login} replace={true} state={{from: location.state?.from?.pathname}}/>
}