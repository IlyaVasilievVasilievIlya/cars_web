import { useLayoutEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { ROUTES } from "../../common/routes";
import { authStore } from "../../store/authStore";


export const Logout: React.FC = () => {
    
    const location = useLocation();

    const navigate = useNavigate();

    const fromPage = location.state?.from?.pathname ?? ROUTES.Home;

    useLayoutEffect(() => {
        authStore.logOut()
            .then(() => navigate(ROUTES.Login, {replace: true, state:{from: fromPage}}))
            .catch(() => navigate(fromPage, {replace: true}));
    }, [fromPage, navigate])
    
    return null;
}