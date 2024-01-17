
import { CarsPage } from "../pages/Cars/CarsPage";
import { UsersPage } from '../pages/Users/UsersPage';

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

export const Admin = "Administrator";
export const SuperUser =  "SuperUser";
export const Manager = "Manager";
export const User = "User";


