import {Service} from 'egg';
import permission, {Filter} from "../model/permission";
import type {PermissionType} from "../model/permission";


export default class Permission extends Service {

    async createPermission(payload: PermissionType) {

        const {ctx} = this;
        const model = permission(ctx);
        // todo... check  if parent  already has the permission
        await model.createPermission(payload);

    }

    async updatePermission(payload: PermissionType & { id: number }) {

        const {ctx} = this;
        const model = permission(ctx);
        await model.updatePermission(payload);

    }

    async deletePermission(payload: { id: number }) {
        const {ctx} = this;
        const model = permission(ctx);
        await model.delPermission(payload);

    }

    async updatePermissionState(payload: { id: number, state: 0 | 1 }) {

        const {ctx} = this;
        const model = permission(ctx);
        await model.updatePermissionState(payload);

    }

    async queryPermissionList(payload: Filter) {

        const {ctx} = this;
        const model = permission(ctx);
        return model.queryPermissionList(payload);

    }
}

