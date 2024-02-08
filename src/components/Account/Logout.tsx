import { Navigate } from "react-router-dom"
import { authStore } from "../../store/authStore"
import { useLayoutEffect } from "react";


export const Logout: React.FC = () => {
    
    useLayoutEffect(() => {
        authStore.logout();
    }, [])
    
    return <Navigate to="/login" replace={true}/>
}