import {defineStore} from "pinia";
import instance, {version, createQuery} from "@/stores/network";

export type UserInfo = { id?: number, username: string, password: string, email: string, phone: string };

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


    const getUsersAction = async (payload: UserFilter): Promise<{ total: number, list: UserRow[] }> => {

        const query = createQuery(payload);
        const {data} = await instance.get(`/${version}/users?${query}`);
        return data;

    }

    const createUserAction = async (payload: UserInfo) => {

        return instance.post(`/${version}/user`, payload);
    }

    const updateUserAction = async (payload: Partial<UserInfo>) => {

        return instance.put(`/${version}/user`, payload);

    }

    const deleteUserAction = async (payload: { id: number }) => {

        return instance.delete(`/${version}/user?id=${payload.id}`)
    }

    const updateUserStateAction = async (payload: { id: number, state: number }) => {

        return instance.put(`/${version}/user-state`, payload);
    }

    const deleteUserRoleAction = async (payload: { id: number, roleId: number }) => {

        const query = createQuery(payload);
        return instance.delete(`/${version}/user-role?${query}`);

    }

    const createUserRoleAction = async (payload: { id: number, roleId: number }) => {

        return instance.post(`/${version}/user-role`, payload);

    }


    const exportUsersResultAction = async (payload: UserFilter) => {

        const query = createQuery(payload);

        return instance.get(`/${version}/users-result?${query}`, {responseType: 'blob'});
    }

    return {

        getUsersAction,
        createUserAction,
        updateUserAction,
        deleteUserAction,
        updateUserStateAction,
        deleteUserRoleAction,
        createUserRoleAction,
        exportUsersResultAction

    }

})