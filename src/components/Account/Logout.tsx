import { Navigate } from "react-router-dom"
import { authStore } from "../../store/authStore"


export const Logout: React.FC = () => {
    
    authStore.setAuthInfo();
    
    return <Navigate to="/login" />
}