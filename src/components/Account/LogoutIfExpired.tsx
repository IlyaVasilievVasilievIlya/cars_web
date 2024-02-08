import { Navigate } from "react-router-dom"
import { ROUTES } from "../../common/routes"
import { authStore } from "../../store/authStore"

export const LogoutIfExpired = () => {

    return (
        (authStore.errorCode === 401) ? <Navigate to={ROUTES.Logout} replace={true}/> : null
    )
}