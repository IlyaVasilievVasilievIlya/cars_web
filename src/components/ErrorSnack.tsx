import { Box, Snackbar } from "@mui/material"
import { useState } from "react";

interface ErrorSnackProps {
    error: string
}

export function ErrorSnack({ error }: ErrorSnackProps) {
    const [isOpen, setIsOpen] = useState(true);

    return (
        <Box sx={{ width: 500 }}>
            <Snackbar
            open={isOpen}
            autoHideDuration={6000}
                anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
                message={error} 
                onClose={() => setIsOpen(false)}/>
        </Box>
    )
}