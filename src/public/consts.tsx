
import { createBrowserRouter } from "react-router-dom";
import { Login } from "../components/Account/Users/Login";
import { Register } from "../components/Account/Users/Register";
import { RequireAuth } from "../components/Account/Users/RequireAuth";
import { CarsPage } from "../pages/Cars/CarsPage";
import { HomePage } from "../pages/HomePage";
import { UsersPage } from '../pages/Users/UsersPage';
import { NotFoundPage } from "../pages/NotFoundPage";

export const API_URL = "https://localhost:7154/api";

interface NavInfo {
    path: string;
    text: string;
    element: React.ReactElement;
    key: string;
}

export const navInfos: NavInfo[] = [
    {path: "/", text: "", element:<CarsPage />, key: "/"},
    {path: "/cars", text: "Cars", element:<UsersPage />, key: "/cars"},
    {path: "/users", text: "Users", element:<UsersPage />, key: "/users"}
];

export const ROLES = {
    'Admin': "Administrator",
    'SuperUser': "SuperUser",
    'Manager': "Manager",
    'User': "User"
}

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
            }
        ]
    }
])

