import { Typography } from "@mui/material"

interface ErrorMessageProps {
    error: string
}

export function ErrorMessage({ error }: ErrorMessageProps) {
    return (
        <Typography>
            {error}
        </Typography>
    )
}