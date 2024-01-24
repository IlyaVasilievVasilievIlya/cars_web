
import { createBrowserRouter } from "react-router-dom";
import { Login } from "../components/Account/Login";
import { Register } from "../components/Account/Register";
import { RequireAuth } from "../components/Account/RequireAuth";
import { CarsPage } from "../pages/Cars/CarsPage";
import { HomePage } from "../pages/HomePage";
import { UsersPage } from '../pages/Users/UsersPage';
import { NotFoundPage } from "../pages/NotFoundPage";
import { Logout } from "../components/Account/Logout";
import { Unauthorized } from "../components/Account/Unauthorized";

interface NavInfo {
    path: string;
    text: string;
    element: React.ReactElement;
    key: string;
    allowedRoles?: string[];
}

export const ROLES = {
    'Admin': "Administrator",
    'SuperUser': "SuperUser",
    'Manager': "Manager",
    'User': "User"
}

export const roleList = ['Administrator', 'Manager', 'User'] as const;


export const navInfos: NavInfo[] = [
    {path: "/", text: "", element:<CarsPage />, key: "/", allowedRoles: [ROLES.User, ROLES.SuperUser, ROLES.Admin, ROLES.Manager]},
    {path: "/cars", text: "Cars", element:<CarsPage />, key: "/cars", allowedRoles: [ROLES.User, ROLES.SuperUser, ROLES.Admin, ROLES.Manager]},
    {path: "/users", text: "Users", element:<UsersPage />, key: "/users", allowedRoles: [ROLES.SuperUser, ROLES.Admin]},
];


export const router = createBrowserRouter([
    {
        path: "/login",
        element: <Login/>
    },
    {
        path: "/register",
        element: <Register/>
    },
    {
        element: <RequireAuth allowedRoles={[ROLES.User, ROLES.SuperUser, ROLES.Admin, ROLES.Manager]}/>,
        children: [
            {
                path: "/cars",
                element: <CarsPage/>
            },
            {
                element: <RequireAuth allowedRoles={[ROLES.SuperUser, ROLES.Admin]}/>,
                children: [
                    {
                        path: "/users",
                        element: <UsersPage/>
                    }
                ]
            },
            {
                path: "/",
                element: <HomePage/>
            },
            {
                path: "*",
                element: <NotFoundPage/>
            },
            {
                path: "/logout",
                element: <Logout/>
            },
            {
                path: "/unauthorized",
                element: <Unauthorized/>
            }
        ]
    }
])

