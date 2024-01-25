import React, { useState, useEffect } from 'react';

import '../styles.css';
import { EditUser } from './EditUser';
import { ErrorMessage } from '../ErrorMessage';
import { observer } from 'mobx-react-lite';
import { usersStore } from '../../store/usersStore';
import { ChangeUserRoleRequest, EditUserRequest, User } from '../model';
import { Button, Card, CardActions, CardContent, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, IconButton, List, ListItem, ListItemText, Typography } from '@mui/material';
import EditIcon from '@mui/icons-material/Edit'
import { useNavigate } from 'react-router-dom';
import { authStore } from '../../store/authStore';

export const UserList: React.FC = observer(() => {

    const [user, setUser] = useState<User>();

    const [isOpenEditModal, setIsOpenEditModal] = useState(false);

    const navigate = useNavigate();

    if (authStore.errorCode == 401){
        navigate("/login");
    }

    function openEditModal(id: string) {
        const selectedUser = usersStore.users.find(el => el.id == id);

        if (selectedUser) {
            setUser(selectedUser);
            setIsOpenEditModal(true);
        }
    }

    let userList = usersStore.users.map(userElem =>
        <Card key={userElem.id}>
            <CardContent>
                <Typography>
                    {userElem.name} {userElem.surname} {userElem.patronymic}
                </Typography>
                <Typography>
                    {userElem.role}
                </Typography>
                <Typography>
                    {userElem.birthDate.toString()}
                </Typography>
                <CardActions disableSpacing={true}>
                    <IconButton onClick={() => openEditModal(userElem.id)}>
                        <EditIcon />
                    </IconButton>
                </CardActions>
            </CardContent>
        </Card>);

    useEffect(() => {
        usersStore.fetchUsers();
    }, [])


    return (
        <>
            {usersStore.fetchError && <ErrorMessage error={usersStore.fetchError} />}

            {/* {loading && <Loader />} */}

            {!usersStore.fetchError && <List>
                {userList}
            </List>}

            {isOpenEditModal && user && <EditUser user={user} onDone={() => setIsOpenEditModal(false)} />}
        </>
    );
});