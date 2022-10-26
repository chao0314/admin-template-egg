import {defineStore} from "pinia";
import instance, {createQuery, version} from "@/stores/network";
import {filterObj} from "@/utils";

export type Role = { id: number, name: string, des: string, state?: number };
export type RoleFilter = Partial<{ keyword: string, page: number, pageSize: number }>;
export type PermissionRow = { id: number, name: string, type: string, level: number, pid: number };

export const useRole = defineStore('role', () => {


    const getRolesAction = async (payload: RoleFilter = {}): Promise<{ total: number, list: Role[] }> => {

        const query = createQuery(payload);
        const {data} = await instance.get(`/${version}/roles?${query}`);
        return data;
    }

    const createRoleAction = async (payload: Omit<Role, 'id'>) => {

        return instance.post(`/${version}/role`, filterObj(payload));

    }

    const updateRoleAction = async (payload: Partial<Role>) => {

        return instance.put(`/${version}/role`, payload);

    }

    const updateRoleStateAction = async (payload: { id: number, state: number }) => {

        return instance.put(`/${version}/role-state`, payload);

    }

    const deleteRoleAction = async (payload: { id: number }) => {

        return instance.delete(`/${version}/role?id=${payload.id}`);

    }

    const getRolePermissionsAction = async (payload: { id: number }): Promise<PermissionRow[]> => {

        const {data} = await instance.get(`/${version}/role-permiss?id=${payload.id}`);
        return data;

    }

    const updateRolePermissionsAction = async (payload: { id: number, permissIdList: number[] }) => {

        return instance.put(`/${version}/role-permiss`, payload);

    }


    return {

        getRolesAction,
        createRoleAction,
        updateRoleAction,
        deleteRoleAction,
        updateRoleStateAction,
        getRolePermissionsAction,
        updateRolePermissionsAction

    }

})