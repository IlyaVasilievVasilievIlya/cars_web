import React, { useEffect, useState } from 'react';

import { LinearProgress, List, Pagination } from '@mui/material';
import { observer } from 'mobx-react-lite';
import { useNavigate } from 'react-router-dom';
import { authStore } from '../../store/authStore';
import { usersStore } from '../../store/usersStore';
import { ErrorSnack } from '../ErrorSnack';
import { User } from '../model';
import '../styles.css';
import { EditUser } from './EditUser';
import { UserListItem } from './UserListItem';
import { PAGE_SIZE } from '../../public/consts';

export const UserList: React.FC = observer(() => {

    const [user, setUser] = useState<User>();

    const [isOpenEditModal, setIsOpenEditModal] = useState(false);

    const [page, setPage] = useState(1);

    const navigate = useNavigate();

    if (authStore.errorCode === 401) {
        navigate("/logout");
    }

    function openEditModal(id: string) {
        const selectedUser = usersStore.users.find(el => el.id === id);

        if (selectedUser) {
            setUser(selectedUser);
            setIsOpenEditModal(true);
        }
    }

    const paginatedList = usersStore.users.slice((page - 1) * PAGE_SIZE, (page) * PAGE_SIZE);

    const totalPages = Math.ceil(usersStore.users.length / PAGE_SIZE);

    let userList = paginatedList.map(userElem =>
        <UserListItem user={userElem} openEdit={openEditModal} key={userElem.id} />);

    useEffect(() => {
        usersStore.fetchUsers();
    }, [])

    return (
        <>
            {usersStore.loading && <LinearProgress />}

            {usersStore.fetchError && <ErrorSnack error={usersStore.fetchError} />}

            {!usersStore.fetchError && !usersStore.loading && !!usersStore.users.length &&
                <>
                    <Pagination
                        count={totalPages}
                        page={page}
                        onChange={(_, num) => setPage(num)}>
                    </Pagination>
                    <List>
                        {userList}
                    </List>
                </>}
            {isOpenEditModal && user && <EditUser user={user} onDone={() => setIsOpenEditModal(false)} />}
        </>
    );
});