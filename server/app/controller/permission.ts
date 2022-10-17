import {Controller} from 'egg';
import {PermissionRow} from "../model/permission";
import {validateNumberObj, validateStringObj} from "../descriptor/regexp";

export default class Permission extends Controller {

    async createPermission() {

        const {ctx, service} = this;
        const {pid, name, des, type, level, path, method} = ctx.request.body;

        // todo... validate params

        await service.permission.createPermission({pid, name, des, type, level, path, method});

        ctx.success();

    }


    async updatePermission() {

        const {ctx, service} = this;
        const {id, pid, name, des, type, level, path, method} = ctx.request.body;

        if (!id) return ctx.badRequest(`id ${id}`);

        //todo... validate params

        await service.permission.updatePermission({id, pid, name, des, type, level, path, method});

        ctx.success();


    }

    async deletePermission() {

        const {ctx, service} = this;

        const {id} = ctx.request.body;

        if (!id) return ctx.badRequest(`id ${id}`);

        await service.permission.deletePermission({id});

        ctx.success();

    }


    async updatePermissionState() {

        const {ctx, service} = this;
        const {id, state} = ctx.request.body;

        if (isNaN(id) || isNaN(state)) return ctx.badRequest(`id ${id} state ${state}`);

        // todo... validate params

        await service.permission.updatePermissionState({id, state});
        ctx.success();

    }

    async queryPermissionList() {

        const {ctx, service} = this;

        const {type, keyword, page = 1, pageSize = 10} = ctx.request.body;

        const strObj = validateStringObj({type, keyword});
        const numObj = validateNumberObj({page, pageSize});
        if (numObj instanceof Error) return ctx.badRequest(numObj.message);

        const data: { total: number, list: PermissionRow[] } = await service.permission.queryPermissionList(
            {...strObj, ...numObj} as { page: number, pageSize: number }
        );

        ctx.success(data);

    }


}