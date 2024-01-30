import { ChangeUserRoleRequest, EditUserRequest, User } from '../components/model';
import { makeAutoObservable } from 'mobx';
import { UserService } from '../services/UserService';

class UsersStore {
    users: User[] = [];

    fetchError?: string;

    actionError?: string;

    constructor(){
        makeAutoObservable(this);
    }

    setUsers(users: User[]) {
        this.users = users;
    }

    setFetchError(error?: string) {
        this.fetchError = error;
    }

    setActionError(error?: string) {
        this.actionError = error;
    }

    async editUser(id: string, editedUser: EditUserRequest) {
        this.setActionError();
        try {
            await UserService.editUser(id, editedUser);
            this.users = this.users.map((elem:User) => (
                elem.id === id) ? {...editedUser, id: id, email: elem.email, role: elem.role}: elem);
        } catch (e) {
            console.log('edituser error '.concat((e as Error).message));
            this.setActionError((e as Error).message);
        }
    }

    async changeUserRole(id: string, newRole: ChangeUserRoleRequest) {
        this.setActionError();
        try {
            await UserService.changeUserRole(id, newRole);
            this.users = this.users.map((elem:User) => (
                elem.id === id) ? {...elem, role: newRole.role} : elem);
        } catch (e) {
            console.log('changerole error '.concat((e as Error).message));
            this.setActionError((e as Error).message);
        }
    }

    async fetchUsers() {
        this.setFetchError();
        try {
            const response = await UserService.fetchUsers();
            this.setUsers(response.data.map(elem => ({...elem, birthDate: new Date(elem.birthDate)})));
        } catch (e) {
            console.log('fetchusers error '.concat((e as Error).message));
            this.setFetchError((e as Error).message);
        }
    }
};

export const usersStore = new UsersStore();