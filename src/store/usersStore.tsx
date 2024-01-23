import { ChangeUserRoleRequest, EditUserRequest, User } from '../components/model';
import { makeAutoObservable } from 'mobx';
import { UserService } from '../services/UserService';

class UsersStore {
    users: User[] = [];

    error?: string;

    constructor(){
        makeAutoObservable(this);
    }

    setUsers(users: User[]) {
        this.users = users;
    }

    setError(error?: string) {
        this.error = error;
    }

    async editUser(id: string, editedUser: EditUserRequest) {
        this.setError();
        try {
            await UserService.editUser(id, editedUser);
            this.users = this.users.map((elem:User) => (
                elem.id == id) ? {...editedUser, id: id, email: elem.email, role: elem.role } : elem);
        } catch (e) {
            console.log('edituser error '.concat((e as Error).message));
            this.setError((e as Error).message);
        }
    }

    async changeUserRole(id: string, newRole: ChangeUserRoleRequest) {
        this.setError();
        try {
            await UserService.changeUserRole(id, newRole);
            this.users = this.users.map((elem:User) => (
                elem.id == id) ? {...elem, role: newRole.role} : elem);
        } catch (e) {
            console.log('changerole error '.concat((e as Error).message));
            this.setError((e as Error).message);
        }
    }

    async fetchUsers() {
        this.setError();
        try {
            const response = await UserService.fetchUsers();
            this.setUsers(response.data);
        } catch (e) {
            console.log('fetchusers error '.concat((e as Error).message));
            this.setError((e as Error).message);
        }
    }
};

export const usersStore = new UsersStore();