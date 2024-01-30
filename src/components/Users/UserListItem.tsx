import { basketStore } from "../../store/basketStore";
import { Delete } from "@mui/icons-material";
import { User } from "../model";
import { Box, Card, CardActions, CardContent, IconButton, Typography } from '@mui/material';
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
        <Card key={user.id} sx={{borderRadius:3, marginTop:1}}>
            <CardContent sx={{display:"flex", justifyContent:"space-between"}}>
                <Box>
                    <Typography variant={"body1"}>
                        {user.name} {user.surname} {user.patronymic}
                    </Typography>
                    <Typography variant={"body2"}>
                        {UserService.formatDate(user.birthDate)}
                    </Typography>
                    <Typography variant={"body2"} color={"gray"}>
                        {user.role}
                    </Typography>
                </Box>
                <CardActions>
                    <IconButton onClick={() => openEdit(user.id)}>
                        <EditIcon />
                    </IconButton>
                </CardActions>
            </CardContent>
        </Card>
    )
};