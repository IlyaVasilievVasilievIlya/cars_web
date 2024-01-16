
import { CarsPage } from "../pages/Cars/CarsPage";

export const API_URL = "http://localhost:7154/api/";

interface NavInfo {
    path: string;
    text: string;
    element: React.ReactElement;
    key: string;
}

export const navInfos: NavInfo[] = [
    {path: "/", text: "Cars", element:<CarsPage/>, key: "/"}
  ];