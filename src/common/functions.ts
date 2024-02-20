export function debounce(func: Function, ms: number) {
    let timeout: ReturnType<typeof setTimeout>;
    return function <Type>(...args: Type[]) {
        clearTimeout(timeout);
        timeout = setTimeout(function () { func.apply(null, args) }, ms)
    }
}

export async function getBase64(file: File): Promise<string> {
    let reader = new FileReader();

    return new Promise((resolve, reject) => {
        reader.readAsDataURL(file);
        reader.onload = function () {
            resolve(reader.result as string)
        };
        reader.onerror = function (error) {
            console.log('get base64 Error: ', error);
            reject();
        };
    })
}