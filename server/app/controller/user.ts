import {Controller} from "egg";
import {validateNumber,validateString} from "../descriptor/regexp";
import {usernameDes, emailDes, phoneDes, passwordDes, mergeDes, ValidateError} from "../descriptor";
import {UserRow} from "../model/user";
import {PermissionRow} from "../model/user";

type UserInfo = { username: string, email: string, phone: string, password: string, id?: number };
export default class User extends Controller {

    private async validateUserInfo(user: UserInfo): Promise<boolean | void> {


        const {ctx} = this;
        const emailDesTemp = mergeDes(emailDes, {email: {required: false}});
        const phoneDesTemp = mergeDes(phoneDes, {phone: {required: false}});

        try {

            const des = [usernameDes, emailDesTemp, phoneDesTemp];
            if (!user.id) des.push(passwordDes);
            await ctx.validate(user, des);

            return true;
        } catch (e: unknown) {

            ctx.badRequest((e as ValidateError).errors[0].message);
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
        if (!id) return ctx.badRequest(`id ${id}`);
        //todo...validate params

        const error = await service.user.updateUser(user);
        if (error instanceof Error) ctx.failure(error.message);
        else ctx.success();


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
        if (!id || state === undefined) ctx.badRequest(`id ${id} state ${state}`);
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
        const {role, origin, state, keyword, pageSize = 10, page = 1} = ctx.request.query;
        //todo... validate params

        const res =  validateNumber([role,pageSize,page]);
        if(res instanceof Error) return ctx.badRequest(res.message);



        const data: { total: number, list: UserRow[] } = await service.user.queryUserList({
            role,
            origin,
            state,
            keyword,
            page: Number(page),
            pageSize: Number(pageSize)
        });

        ctx.success(data);

    }

    async queryUserPermissionList() {

        const {ctx, service} = this;
        const {id} = ctx.request.query;
        const nid = Number(id)

        if (!id || isNaN(nid)) return ctx.badRequest(`id ${id}`);

        const permissionList: PermissionRow[] = await service.user.queryUserPermissionList({id: nid});

        ctx.success(permissionList);

    }
}