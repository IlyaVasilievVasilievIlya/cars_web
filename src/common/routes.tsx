import { createBrowserRouter } from "react-router-dom";
import { CarsPage } from "../pages/Cars/CarsPage";
import { UsersPage } from "../pages/Users/UsersPage";
import { Login } from "../components/Account/Login";
import { Register } from "../components/Account/Register";
import { RequireAuth } from "../components/Account/RequireAuth";
import { HomePage } from "../pages/HomePage";
import { NotFoundPage } from "../pages/NotFoundPage";
import { Logout } from "../components/Account/Logout";
import { Unauthorized } from "../pages/UnauthorizedPage";
import { ROLES } from "./roles";

interface NavInfo {
    path: string;
    text: string;
    element: React.ReactElement;
    key: string;
    allowedRoles?: string[];
}

export const ROUTES = {
    'Login': "/login",
    'Logout': "/logout",
    'Register': "/register",
    'Cars': "/cars",
    'Users': '/users',
    'Home' : '/',
    'Unauthorized': '/unauthorized'
}

export const navInfos: NavInfo[] = [
    {path: ROUTES.Home, text: "", element:<HomePage />, key: ROUTES.Home, allowedRoles: [ROLES.User, ROLES.SuperUser, ROLES.Admin, ROLES.Manager]},
    {path: ROUTES.Cars, text: "Cars", element:<CarsPage />, key: ROUTES.Cars, allowedRoles: [ROLES.User, ROLES.SuperUser, ROLES.Admin, ROLES.Manager]},
    {path: ROUTES.Users, text: "Users", element:<UsersPage />, key: ROUTES.Users, allowedRoles: [ROLES.SuperUser, ROLES.Admin]},
];

export const router = createBrowserRouter([
    {
        path: ROUTES.Login,
        element: <Login/>
    },
    {
        path: ROUTES.Register,
        element: <Register/>
    },
    {
        element: <RequireAuth allowedRoles={[ROLES.User, ROLES.SuperUser, ROLES.Admin, ROLES.Manager]}/>,
        children: [
            {
                path: ROUTES.Cars,
                element: <CarsPage/>
            },
            {
                element: <RequireAuth allowedRoles={[ROLES.SuperUser, ROLES.Admin]}/>,
                children: [
                    {
                        path: ROUTES.Users,
                        element: <UsersPage/>
                    }
                ]
            },
            {
                path: ROUTES.Home,
                element: <HomePage/>
            },
            {
                path: "*",
                element: <NotFoundPage/>
            },
            {
                path: ROUTES.Logout,
                element: <Logout/>
            },
            {
                path: ROUTES.Unauthorized,
                element: <Unauthorized/>
            }
        ]
    }
])
