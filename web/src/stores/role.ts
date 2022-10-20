import {defineStore} from "pinia";
import instance, {version} from "@/stores/network";
import type {Role} from "@/stores/user";

export const useRole = defineStore('role', () => {

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


    return {

        getRoles,
        getRolesAction,

    }

})