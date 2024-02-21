import { Close } from "@mui/icons-material";
import { DialogTitle, IconButton } from "@mui/material";
import React from "react";

interface DialogHeaderProps {
    closeForm: () => void;
    text: string;
}

export const DialogHeader: React.FC<DialogHeaderProps> = ({ closeForm, text }: DialogHeaderProps) => {
    return (
        <DialogTitle sx={{ display: 'flex', justifyContent: 'space-between' }}>
            {text}
            <IconButton onClick={closeForm} >
                <Close />
            </IconButton>
        </DialogTitle>
    )
}