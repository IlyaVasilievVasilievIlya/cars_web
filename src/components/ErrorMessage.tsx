
interface ErrorMessageProps {
    error: string
}

export function ErrorMessage({error}:ErrorMessageProps) {
    return (
        <p className="errorMsg">{error}</p>
    )
}