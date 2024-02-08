
export const EMAIL_REGEX = /^([a-zA-Z0-9._-]+@[a-zA-Z0-9._-]+\.[a-zA-Z0-9_-]+)$/;
export const PWD_REGEX = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,24}$/;
export const PAGE_SIZE = 10;

export function debounce(func: Function, ms: number){
    let timeout: ReturnType<typeof setTimeout>;
    return function<Type>(...args: Type[]) {
        clearTimeout(timeout);
        timeout = setTimeout(function() { func.apply(null, args)}, ms)
    }
}




