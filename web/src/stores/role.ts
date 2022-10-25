import {defineStore} from "pinia";
import instance, {createQuery, version} from "@/stores/network";

export type Role = { id: number, name: string, des: string };
export  type RoleFilter = Partial<{ keyword: string, page: number, pageSize: number }>;

export const useRole = defineStore('role', () => {


    const getRolesAction = async (payload: RoleFilter): Promise<{ total: number, list: Role[] }> => {

        const query = createQuery(payload);
        const {data} = await instance.get(`/${version}/roles?${query}`);
        return data;
    }

    const createRoleAction = async (payload: Omit<Role, 'id'>) => {

        return instance.post(`/${version}/role`, payload);

    }

    const updateRoleAction = async (payload: Role) => {

        return instance.put(`/${version}/role`, payload);

    }

    const deleteRoleAction = async (payload: { id: number }) => {

        return instance.delete(`/${version}/role?id=${payload.id}`);

    }

    return {

        getRolesAction,
        createRoleAction,
        updateRoleAction,
        deleteRoleAction

    }

})