import { Navigate } from "react-router-dom"
import { ROUTES } from "../../common/routes"
import { authStore } from "../../store/authStore"

export const LogoutIfExpired = () => {

    return (
        (authStore.isAuth) ?  null : <Navigate to={ROUTES.Logout} replace={true}/>
    )
}