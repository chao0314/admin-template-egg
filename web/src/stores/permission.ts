import {defineStore} from "pinia";
import instance, {createQuery, version} from "@/stores/network";
import {filterObj} from "@/utils";

export type PermissionFilter = Partial<{ type: string, keyword: string, page: number, pageSize: number }>;
export type PermissionType = { pid: number, name: string, des: string, type: string, level: number, state: number, path?: string, method?: string };
export type PermissionRow = PermissionType & { id: number };

export const userPermission = defineStore('permission', () => {

    const getPermissionTypesAction = async (payload: { level: number } = {level: 0}): Promise<PermissionRow[]> => {

        const {data} = await instance.get(`/${version}/permission-type?level=${payload.level}`);
        return data;

    }

    const getPermissionsAction = async (payload: PermissionFilter): Promise<{ total: number, list: PermissionRow[] }> => {

        payload = filterObj(payload);
        const query = createQuery(payload);

        const {data} = await instance.get(`/${version}/permissions?${query}`);
        return data;

    }

    const deletePermissionAction = async (payload: { id: number }) => {

        return instance.delete(`/${version}/permission?id=${payload.id}`);

    }

    const updatePermissionStateAction = async (payload: { id: number, state: number }) => {

        return instance.put(`/${version}/permission-state`, payload);

    }



    return {
        getPermissionTypesAction,
        getPermissionsAction,
        deletePermissionAction,
        updatePermissionStateAction
    }
})