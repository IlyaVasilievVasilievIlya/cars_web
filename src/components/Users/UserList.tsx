import React, { useState, useEffect } from 'react';

import '../styles.css';
import { EditUser } from './EditUser';
import { ErrorSnack } from '../ErrorSnack';
import { observer } from 'mobx-react-lite';
import { usersStore } from '../../store/usersStore';
import { ChangeUserRoleRequest, EditUserRequest, User } from '../model';
import { Button, Card, CardActions, CardContent, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, IconButton, LinearProgress, List, ListItem, ListItemText, Typography } from '@mui/material';
import EditIcon from '@mui/icons-material/Edit'
import { useNavigate } from 'react-router-dom';
import { authStore } from '../../store/authStore';
import { UserListItem } from './UserListItem';

export const UserList: React.FC = observer(() => {

    const [user, setUser] = useState<User>();

    const [isOpenEditModal, setIsOpenEditModal] = useState(false);

    const navigate = useNavigate();

    if (authStore.errorCode === 401){
        navigate("/login");
    }

    function openEditModal(id: string) {
        const selectedUser = usersStore.users.find(el => el.id === id);

        if (selectedUser) {
            setUser(selectedUser);
            setIsOpenEditModal(true);
        }
    }

    let userList = usersStore.users.map(userElem =>
        <UserListItem user={userElem} openEdit={openEditModal}/>);

    useEffect(() => {
        usersStore.fetchUsers();
    }, [])


    return (
        <>
            {usersStore.loading && <LinearProgress/>}

            {usersStore.fetchError && <ErrorSnack error={usersStore.fetchError} />}

            {!usersStore.fetchError && !usersStore.loading && <List>
                {userList}
            </List>}

            {isOpenEditModal && user && <EditUser user={user} onDone={() => setIsOpenEditModal(false)} />}
        </>
    );
});