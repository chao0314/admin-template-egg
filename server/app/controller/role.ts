import {Controller} from 'egg';
// import {emailDes, phoneDes, usernameDes, passwordDes, ValidateError} from "../descriptor";
// import {Locale} from "../../config/locale";

export default class RoleController extends Controller {

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
        //todo...validate

        await service.role.updateRole({id, name, des});
        ctx.success();
    }

    async updateRoleState() {

        const {ctx, service} = this;
        const {id, state} = ctx.request.body;

        if (!id || !state) return ctx.badRequest(`id ${id} state ${state}`);
        await service.role.updateRoleState({id, state});
        ctx.success();

    }

    async deleteRole() {

        const {ctx, service} = this;
        const {id} = ctx.request.body;

        if (!id) return ctx.badRequest(`id ${id}`);
        await service.role.deleteRole({id});
        ctx.success();

    }


}