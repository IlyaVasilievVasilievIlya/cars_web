import { Navigate, useLocation } from "react-router-dom"
import { ROUTES } from "../../common/routes"
import { authStore } from "../../store/authStore"

export const LogoutIfExpired = () => {

    const location = useLocation();

    return (
        (authStore.User) ?  null : <Navigate to={ROUTES.Logout} state={{from: location}}/>
    )
}