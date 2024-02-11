export function debounce(func: Function, ms: number){
    let timeout: ReturnType<typeof setTimeout>;
    return function<Type>(...args: Type[]) {
        clearTimeout(timeout);
        timeout = setTimeout(function() { func.apply(null, args)}, ms)
    }
}