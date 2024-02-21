import { ChangeUserRoleRequest, EditUserRequest, Pagination, QueryParameters, User } from '../components/model';
import { makeAutoObservable } from 'mobx';
import { UserService } from '../services/UserService';

class UsersStore {
    users: User[] = [];

    fetchError?: string;

    actionError?: string;

    loading: boolean = false;

    pagination?: Pagination;

    constructor(){
        makeAutoObservable(this);
    }

    setUsers(users: User[]) {
        this.users = users;
    }

    setPagination(pagination: Pagination) {
        this.pagination = pagination;
    }

    setFetchError(error?: string) {
        this.fetchError = error;
    }

    setActionError(error?: string) {
        this.actionError = error;
    }

    setLoading(loading: boolean) {
        this.loading = loading;
    }

    async editUser(id: string, editedUser: EditUserRequest) {
        this.setActionError();
        this.setLoading(true);
        try {
            await UserService.editUser(id, editedUser);
            this.setUsers(this.users.map((elem:User) => (
                elem.id === id) ? {...editedUser, id: id, email: elem.email, role: elem.role}: elem));
        } catch (e) {
            console.log('edit user error: '.concat((e as Error).message));
            this.setActionError((e as Error).message);
        } finally {
            this.setLoading(false);
        }
    }

    async changeUserRole(id: string, newRole: ChangeUserRoleRequest) {
        this.setActionError();
        this.setLoading(true);
        try {
            await UserService.changeUserRole(id, newRole);
            this.setUsers(this.users.map((elem:User) => (
                elem.id === id) ? {...elem, role: newRole.role} : elem));
        } catch (e) {
            console.log('change role error: '.concat((e as Error).message));
            this.setActionError((e as Error).message);
        } finally {
            this.setLoading(false);
        }
    }

    async fetchUsers(params: QueryParameters) {
        this.setFetchError();
        this.setLoading(true);
        try {
            const response = await UserService.fetchUsers(params);
            this.setPagination(JSON.parse(response.headers['pagination']));
            this.setUsers(response.data.map(elem => ({...elem, birthDate: new Date(elem.birthDate)})));
        } catch (e) {
            console.log('fetchusers error: '.concat((e as Error).message));
            this.setFetchError((e as Error).message);
        } finally {
            this.setLoading(false);
        }
    }
};

export const usersStore = new UsersStore();