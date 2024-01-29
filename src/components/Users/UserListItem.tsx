import { basketStore } from "../../store/basketStore";
import { Delete } from "@mui/icons-material";
import { User } from "../model";
import { Card, CardActions, CardContent, IconButton, Typography } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete'
import EditIcon from '@mui/icons-material/Edit'
import { authStore } from "../../store/authStore";
import { useState } from "react";
import { UserService } from "../../services/UserService";


interface UserListItemProps {
    user: User
    openEdit: (id: string) => void
}

export const UserListItem: React.FC<UserListItemProps> = ({ user, openEdit }: UserListItemProps) => {
    
    return (
        <Card key={user.id}>
            <CardContent>
                <Typography>
                    {user.name} {user.surname} {user.patronymic}
                </Typography>
                <Typography>
                    {user.role}
                </Typography>
                <Typography>
                    {UserService.formatDate(user.birthDate)}
                </Typography>
                <CardActions disableSpacing={true}>
                    <IconButton onClick={() => openEdit(user.id)}>
                        <EditIcon />
                    </IconButton>
                </CardActions>
            </CardContent>
        </Card>
    )
};