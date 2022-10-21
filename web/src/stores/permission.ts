import {defineStore} from "pinia";
import instance, {createQuery, version} from "@/stores/network";
import {filterObj} from "@/utils";

export type PermissionFilter = Partial<{ type: string, keyword: string, page: number, pageSize: number }>;
export type PermissionType = { pid: number, name: string, des: string, type: string, level: number, state: number, path?: string, method?: string };
export type PermissionRow = PermissionType & { id: number };
export type PermissionNode = { id: number, label: string, children?: PermissionNode[] };

export const userPermission = defineStore('permission', () => {

    let permissionTreeCache: PermissionNode[];
    let permissionTypeDepthMapCache: Map<string, number>;


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


    const getAllPermissionsAction = async (lazy = true) => {

        if (lazy && permissionTreeCache && permissionTypeDepthMapCache)
            return [permissionTreeCache, permissionTypeDepthMapCache];

        const permissions: PermissionRow[] = await instance.get(`/${version}/permissions-all`);

        const permissionTree: PermissionNode[] = [];
        const levelPermissionMap = new Map<number, PermissionRow[] | PermissionNode[]>();
        const permissionTypeDepthMap = new Map<string, number>();
        for (const perm of permissions) {

            const {type, level} = perm;
            const levelList = levelPermissionMap.get(level);
            if (levelList) (levelList as PermissionRow[]).push(perm);
            else levelPermissionMap.set(level, [perm]);

            const curLevel = permissionTypeDepthMap.get(type);

            if (!curLevel || (curLevel && curLevel < level)) permissionTypeDepthMap.set(type, level);

        }

        const sortedLevels = Array.from(levelPermissionMap.keys()).sort((a, b) => (a - b));

        for (const level of sortedLevels) {

            const levelPermissions = levelPermissionMap.get(level) as PermissionRow[];

            if (levelPermissions) {

                if (level === 0) {
                    const nodes = levelPermissions.map((perm) => ({
                        id: perm.id,
                        label: perm.name,
                        children: []
                    }));
                    levelPermissionMap.set(level, nodes);
                    permissionTree.push(...nodes);
                } else {

                    const parentLevelNodes = levelPermissionMap.get(level - 1) as PermissionNode[];

                    parentLevelNodes && levelPermissions.forEach(perm => {

                        const patentNode = parentLevelNodes.find(parent => parent.id === perm.pid);

                        patentNode && patentNode.children?.push({id: perm.id, label: perm.name, children: []});


                    })


                }

            }


        }

        permissionTreeCache = permissionTree;
        permissionTypeDepthMapCache = permissionTypeDepthMap;
        return [permissionTree, permissionTypeDepthMap];

    }


    return {
        getPermissionTypesAction,
        getPermissionsAction,
        deletePermissionAction,
        updatePermissionStateAction,
        getAllPermissionsAction
    }
})