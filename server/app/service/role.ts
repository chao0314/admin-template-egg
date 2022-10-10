import {Service} from 'egg';
import role from '../model/role';
import {Locale} from "../../config/locale";

export default class Role extends Service {

    async createRole(payload: { name: string, des: string }): Promise<Error | void> {

        const {ctx} = this;
        const model = role(ctx);
        const {name, des} = payload;
        const roles = await model.queryRoleByName({name});
        if (roles.length > 0) return new Error(ctx.__(Locale.roleAlreadyExists));
        await model.createRole({name, des});
    }

    async updateRole(payload: { id: number, name: string, des: string }) {

        const {ctx} = this;
        const model = role(ctx);
        await model.updateRole(payload);

    }

    async updateRoleState(payload: { id: number, state: 0 | 1 }) {

        const {ctx} = this;
        const model = role(ctx);
        await model.updateRoleState(payload);

    }

    async deleteRole(payload: { id: number }) {

        const {ctx} = this;
        const model = role(ctx);
        await model.delRoleById(payload);
    }

}
