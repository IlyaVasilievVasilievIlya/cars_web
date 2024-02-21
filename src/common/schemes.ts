import { date, mixed, number, object, ref, string } from "yup";
import { EMAIL_REGEX, PWD_REGEX } from "./consts";
import { UserRole } from "../components/model";

export const registerSchema = object({
    email: string().required('Это обязательное поле').matches(EMAIL_REGEX, 'Некорректный адрес почты'),
    password: string().required('Это обязательное поле').matches(PWD_REGEX, 'Пароль должен иметь длину от 8 до 24 символов, содержать заглавные и строчные латинские символы, служебные символы и цифры'),
    confirmPassword: string().required('').oneOf([ref("password")], 'Пароли не совпадают'),
    name: string().required('Это обязательное поле').max(128, 'Имя не должно содержать более 128 символов'),
    surname: string().required('Это обязательное поле').max(128, 'Фамилия не должна содержать более 128 символов'),
    patronymic: string().max(128, 'Отчество не должно содержать более 128 символов'),
    birthDate: date().typeError('').required('Это обязательное поле').min("1923-01-01", 'дата должна быть не ранее 1923.01.01').max(new Date(), `Некорректная дата`)
});

export const loginSchema = object({
    email: string().required('Это обязательное поле').matches(EMAIL_REGEX, 'Некорректный адрес почты'),
    password: string().required('Это обязательное поле').matches(PWD_REGEX, 'Пароль должен иметь длину от 8 до 24 символов, содержать заглавные и строчные латинские символы, служебные символы и цифры')
});

export const editUserSchema = object({
    name: string().required('Это обязательное поле'),
    surname: string().required('Это обязательное поле'),
    patronymic: string(),
    birthDate: date().required('Это обязательное поле')
})

export const changeRoleSchema = object({
    role: mixed<UserRole>().required('Это обязательное поле')
})

export const addCarSchema = object({
    carModelId: number().required('Это обязательное поле'),
    color: string().max(128, 'Поле не должно содержать более 128 символов'),
    image: mixed<FileList>().required("Файл не выбран")
        .test('Файл не выбран', 'Файл не выбран', (list) => {
            if (!list || !list[0]) return false;
            return true;
        })
        .test('Некорретный размер файла', 'Некорретный размер файла', (list) => { 
            if (!list || !list[0]) return true;
            if (list![0].size === 0 || list![0].size > 2000000) return false;
            return true;
        })
        .test('Некорректное расширение файла', 'Некорректное расширение файла', (list) => {
            if (!list || !list[0]) return true;
            if (list![0].type !== "image/jpeg") return false;
            return true;
        })
})

export const editCarSchema = addCarSchema.shape({
    carId: number().required()
})