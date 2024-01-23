import React, { useState, useEffect } from 'react';

import '../styles.css';
import { EditUser } from './EditUser';
import { ErrorMessage } from '../ErrorMessage';
import { observer } from 'mobx-react-lite';
import { usersStore } from '../../store/usersStore';
import { ChangeUserRoleRequest, EditUserRequest, User } from '../model';
import { Button, Card, CardActions, CardContent, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, IconButton, List, ListItem, ListItemText, Typography } from '@mui/material';
import EditIcon from '@mui/icons-material/Edit'

export const UserList: React.FC = observer(() => {

    const [user, setUser] = useState<User>();

    const [isOpenEditModal, setIsOpenEditModal] = useState(false);

    const [isOpenDeleteModal, setIsOpenDeleteModal] = useState(false);

    const [error, setError] = useState<string | undefined>();

    const editUser = async (id: string, editedUser: EditUserRequest) => {
        await usersStore.editUser(id, editedUser);

        console.log(usersStore.users);

        if (!usersStore.error) {
            setError(usersStore.error);
        }
    }

    const changeRole = async (id: string, newRole: ChangeUserRoleRequest) => {
        await usersStore.changeUserRole(id, newRole);

        console.log( usersStore.users);

        if (!usersStore.error) {
            setError(usersStore.error);
        }
    }

    function openDeleteModal(id: string) {
        const selectedUser = usersStore.users.find(el => el.id == id);

        if (selectedUser) {
            setUser(selectedUser);
            setIsOpenDeleteModal(true);
        }
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
            {error && <ErrorMessage error={error} />}

            {/* {loading && <Loader />} */}

            {!usersStore.error && <List>
                {userList}
            </List>}

            {isOpenEditModal && user && <EditUser user={user} onDone={() => setIsOpenEditModal(false)} onEdit={editUser} onRoleChange={changeRole}/>}
        </>
    );
});