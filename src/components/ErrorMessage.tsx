
interface ErrorMessageProps {
    error: string
}

export function ErrorMessage({error}:ErrorMessageProps) {
    return (
        <span className="errorMsg">{error}</span> 
    )
}