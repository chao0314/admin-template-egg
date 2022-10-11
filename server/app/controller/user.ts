import {Controller} from "egg";
import {usernameDes, emailDes, phoneDes, passwordDes, mergeDes, ValidateError} from "../descriptor";
import {UserRow} from "../model/user";

type UserInfo = { username: string, email: string, phone: string, password: string, id?: number };
export default class User extends Controller {

    private async validateUserInfo(user: UserInfo): Promise<boolean | void> {


        const {ctx} = this;
        const emailDesTemp = mergeDes(emailDes, {email: {required: false}});
        const phoneDesTemp = mergeDes(phoneDes, {phone: {required: false}});

        try {

            await ctx.validate(user, [usernameDes, emailDesTemp, phoneDesTemp, passwordDes]);

            return true;
        } catch (e: unknown) {

            ctx.badRequest((e as ValidateError).errors[0].fieldValue);
        }
    }

    async createUser() {
        const {ctx, service} = this;
        const {username, email, phone, password,} = ctx.request.body;
        const user = {username, email, phone, password};
        const pass = await this.validateUserInfo(user);

        if (pass) {
            const error = await service.user.createUser(user);
            if (error instanceof Error) ctx.failure(error.message);
            else ctx.success();
        }

    }

    async updateUser() {

        const {ctx, service} = this;
        const {id, username, email, phone, password} = ctx.request.body;
        const user = {id, username, email, phone, password};
        const pass = await this.validateUserInfo(user);
        if (pass) {
            const error = await service.user.updateUser(user);
            if (error instanceof Error) ctx.failure(error.message);
            else ctx.success();
        }

    }

    async deleteUser() {

        const {ctx, service} = this;
        const {id} = ctx.request.body;
        if (!id) ctx.badRequest(`id ${id}`);
        else {
            await service.user.delUser(id);
            ctx.success();
        }


    }

    async updateUserState() {

        const {ctx, service} = this;
        const {id, state} = ctx.request.body;
        if (id! || !state) ctx.badRequest(`id ${id} state ${state}`);
        else {
            await service.user.updateUserState({id, state});
            ctx.success();
        }

    }

    async createUserRole() {

        const {ctx, service} = this;
        const {id, roleId} = ctx.request.body;
        if (!id || !roleId) ctx.badRequest(`id ${id} roleId ${roleId}`);
        else {
            await service.user.createUserRole({id, roleId});
            ctx.success();
        }

    }

    async delUserRole() {

        const {ctx, service} = this;
        const {id, roleId} = ctx.request.body;
        if (!id || !roleId) ctx.badRequest(`id ${id} roleId ${roleId}`);
        else {
            await service.user.delUserRole({id, roleId});
            ctx.success();
        }

    }

    async queryUserList() {

        const {ctx, service} = this;
        const {filter: {role, origin, state, keyword, pageSize = 10, page = 1}} = ctx.request.body;

        const data: { total: number, list: UserRow[] } = await service.user.queryUserList({
            role,
            origin,
            state,
            keyword,
            page,
            pageSize
        });

        ctx.success(data);

    }
}