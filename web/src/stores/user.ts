import {defineStore} from "pinia";
import instance, {version, createQuery} from "@/stores/network";

export type Role = { id: string, name: string, des: string };

export interface UserRow {
    id: number
    state: number,
    username: string,
    email: string
    phone: string
    roles: { roleId: number, roleName: string }[]
}

export type UserFilter = Partial<{ state: number, origin: string, role: number, keyword: string, page: number, pageSize: number }>
export const useUser = defineStore('user', () => {

    let roles: Role[];

    const getRoles = async (): Promise<Role[]> => {

        if (roles) return roles;
        else {
            const {data: {list}} = await getRolesAction();
            roles = list;
            return roles;

        }
    }

    const getRolesAction = async () => {

        return instance.get(`/${version}/roles`);

    }

    const getUsersAction = async (payload: UserFilter): Promise<{ total: number, list: UserRow[] }> => {

        const query = createQuery(payload);
        const {data} = await instance.get(`/${version}/users?${query}`);
        return data;


    }

    return {

        getRoles,
        getRolesAction,
        getUsersAction

    }

})