import { AxiosResponse } from "axios";
import { api } from "../http";
import { ChangeUserRoleRequest, EditUserRequest, User, UserResponse } from "../components/model";

export class UserService {

    static formatDate(date: Date) {

        const y = date.getFullYear();
        const m = date.getMonth() + 1;

        const d = date.getDate();
        return '' + y + '-' + (m<=9 ? '0' + m : m) + '-' + (d <= 9 ? '0' + d : d);
    }

    static async editUser(id: string, editedUser: EditUserRequest): Promise<AxiosResponse<void>> {

        return api.put(
            `/Users/${id}`,
            JSON.stringify({...editedUser, birthDate: UserService.formatDate(editedUser.birthDate) }))
    }

    static async changeUserRole(id: string, newRole: ChangeUserRoleRequest): Promise<AxiosResponse<void>> {
        return api.patch(
            `/Users/${id}/role`, newRole.role)
    }

    static async fetchUsers(): Promise<AxiosResponse<UserResponse[]>> {
        return api.get(
            '/Users'
        )
    }
}