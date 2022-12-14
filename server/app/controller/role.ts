import {Controller} from 'egg';
// import {emailDes, phoneDes, usernameDes, passwordDes, ValidateError} from "../descriptor";
// import {Locale} from "../../config/locale";
import {RoleRow, PermissionRow} from "../model/role";
import { validateNumberObj, validateStringObj} from "../descriptor/regexp";

export default class Role extends Controller {

    async createRole() {

        const {ctx, service} = this;
        const {name, des} = ctx.request.body;

        //todo... validate

        const error = await service.role.createRole({name, des});
        if (error instanceof Error) ctx.failure(error.message);
        else ctx.success();

    }

    async updateRole() {

        const {ctx, service} = this;
        const {id, name, des} = ctx.request.body;
        if (!id) return ctx.badRequest(`id ${id}`);
        //todo...validate params

        await service.role.updateRole({id, name, des});
        ctx.success();
    }

    async updateRoleState() {

        const {ctx, service} = this;
        const {id, state} = ctx.request.body;

        if (!id || state === undefined) return ctx.badRequest(`id ${id} state ${state}`);
        await service.role.updateRoleState({id, state});
        ctx.success();

    }

    async deleteRole() {

        const {ctx, service} = this;
        const {id} = ctx.request.query;
        const numObj = validateNumberObj({id});
        if (numObj instanceof Error) return ctx.badRequest(numObj.message);
        await service.role.deleteRole(numObj as { id: number });
        ctx.success();

    }

    async queryRoleList() {

        const {ctx, service} = this;

        const {keyword, page = 1, pageSize = 10} = ctx.request.query;

        const strObj = validateStringObj({keyword});
        const numObj = validateNumberObj({page, pageSize});
        if (numObj instanceof Error) return ctx.badRequest(numObj.message);
        const data: { total: number, list: RoleRow[] } = await service.role.queryRoleList({
            ...strObj,
            ...numObj
        } as { page: number, pageSize: number });

        ctx.success(data);
    }

    async updateRolePermission() {

        const {ctx, service} = this;

        const {id, permissIdList} = ctx.request.body;

        if (!id || !Array.isArray(permissIdList) || permissIdList.length === 0) ctx.badRequest(`id ${id} permissIdList ${permissIdList}`);
        else {

            await service.role.updateRolePermission({id, permissIdList});

            ctx.success();

        }


    }

    async queryRolePermissionList() {

        const {ctx, service} = this;

        const {id} = ctx.request.query;

        const numObj = validateNumberObj({id});
        if (numObj instanceof Error) return ctx.badRequest(numObj.message);

        const permissionList: PermissionRow[] = await service.role.queryRolePermissionList(numObj as {id:number});

        ctx.success(permissionList);

    }
}