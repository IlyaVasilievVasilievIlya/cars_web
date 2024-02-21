import React, { useEffect, useState } from 'react';

import { LinearProgress, List, Pagination } from '@mui/material';
import { observer } from 'mobx-react-lite';
import { PAGE_SIZE } from '../../common/consts';
import { usersStore } from '../../store/usersStore';
import { ErrorSnack } from '../ErrorSnack';
import { User } from '../model';
import '../styles.css';
import { EditUser } from './EditUser';
import { UserListItem } from './UserListItem';

export const UserList: React.FC = observer(() => {

    const [user, setUser] = useState<User>();

    const [isOpenEditModal, setIsOpenEditModal] = useState(false);

    const [page, setPage] = useState(1);

    function openEditModal(id: string) {
        const selectedUser = usersStore.users.find(el => el.id === id);

        if (selectedUser) {
            setUser(selectedUser);
            setIsOpenEditModal(true);
        }
    }

    const userList = usersStore.users.map(userElem =>
        <UserListItem user={userElem} openEdit={openEditModal} key={userElem.id} />);

    useEffect(() => {
        usersStore.fetchUsers({
            pageNumber: page,
            pageSize: PAGE_SIZE
        });
    }, [page])

    return (
        <>
            {usersStore.loading && <LinearProgress />}

            {usersStore.fetchError && <ErrorSnack error={usersStore.fetchError} />}

            {!usersStore.fetchError && !usersStore.loading && !!usersStore.users.length &&
                <>
                    <Pagination
                        count={usersStore.pagination?.TotalPages}
                        page={page}
                        onChange={(_, num) => setPage(num)}/>
                    <List>
                        {userList}
                    </List>
                </>}
            <EditUser user={user} isModalOpen={isOpenEditModal && user !== undefined} onClose={() => setIsOpenEditModal(false)} />
        </>
    );
});