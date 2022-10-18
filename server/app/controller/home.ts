import {Controller} from 'egg';
import {emailDes, phoneDes, usernameDes, passwordDes, ValidateError} from "../descriptor";
import {Locale} from "../../config/locale";
import {Row} from "../../lib/plugin/egg-mysql2/typings";
import {PermissionRow} from "../model/user";


export default class Home extends Controller {
    public async index() {
        const {ctx} = this;

        ctx.body = 'hi egg !';
    }

    async getCaptcha() {
        const {app, ctx} = this;
        const {data, text} = this.app.createCaptcha();
        const uid = this.ctx.helper.uuid();
        app.redis.setex(uid, 60, text);
        ctx.cookies.set('uid', uid, {maxAge: 1000 * 60 * 2,});
        ctx.success(data);

    }

    async verifyCaptcha() {

        const {app, ctx} = this;
        const captcha = ctx.request.body.captcha;
        const uid = ctx.cookies.get('uid');
        const rCaptcha = await app.redis.get(uid);
        ctx.success(captcha && rCaptcha && rCaptcha.toLowerCase() === captcha.toLowerCase());

    }


    async sendMail() {

        const {app, ctx} = this;
        const {to} = ctx.query;
        const validator = app.validator(emailDes);
        try {
            await validator.validate({email: to});
        } catch (e: unknown) {
            return ctx.badRequest((e as ValidateError).errors[0].fieldValue);
        }

        const code = await app.redis.get(to);
        if (!code) {
            const name = ctx.__(Locale.development);
            const code = ctx.helper.randomHex(4);
            const body = {
                subject: ctx.__(Locale.emailCode),
                text: ctx.__(Locale.emailText, name, code)
            }

            await app.sendMail(to, body);

            app.redis.setex(to, 60 * 5, code);

        }

        ctx.success();
    }


    async sendSms() {
        const {app, ctx} = this;
        const {phone: phoneNum} = ctx.query;
        const validator = app.validator(phoneDes);
        try {
            await validator.validate({phone: phoneNum});
        } catch (e: unknown) {
            return ctx.badRequest(phoneNum);
        }

        const code = await app.redis.get(phoneNum);
        if (!code) {
            const code = ctx.helper.randomHex(4, 10);
            await app.sendSms(phoneNum, [code, '5']);
            app.redis.setex(phoneNum, 60 * 5, code);
        }


        ctx.success();

    }

    async singUpEmail() {
        const {app, ctx, service} = this;
        const {email, password, code} = ctx.request.body;

        const des = Object.assign({}, emailDes, passwordDes);
        const validator = app.validator(des);
        try {
            await validator.validate({email, password});
        } catch (e) {
            return ctx.badRequest(`${email} ${password}`);
        }

        const rCode = await app.redis.get(email);
        if (code && rCode && rCode === code) {

            const error = await service.home.creatUserByEmail(email, password);
            if (error) ctx.failure(error.message);
            else ctx.success();
        } else ctx.failure(ctx.__(Locale.codeExpired));


    }

    async singUpPhone() {

        const {app, ctx, service} = this;
        const {phone, password, code} = ctx.request.body;

        const rCode = await app.redis.get(phone);

        if (code && rCode && code === rCode) {
            const error = await service.home.createUserByPhone(phone, password);
            if (error) ctx.failure(error.message);
            else ctx.success();
        } else ctx.failure(ctx.__(Locale.codeExpired));

    }

    async singUp() {

        const {app, ctx, service} = this;
        const {username, password} = ctx.request.body;
        const des = Object.assign({}, usernameDes, passwordDes);
        const validator = app.validator(des);

        try {
            await validator.validate({username, password});
        } catch (e: unknown) {
            return ctx.badRequest(`${username} ${password}`);
        }

        const error = await service.home.createUser(username, password);

        if (error instanceof Error) ctx.failure(error.message)

        else ctx.success();


    }

    async singIn() {

        const {ctx, service} = this;

        const {username, password} = ctx.request.body;
        try {
            await ctx.validate({username, password}, [usernameDes, passwordDes]);
        } catch (e: unknown) {
            return ctx.badRequest(`${username} ${password}`);
        }
        const res = await service.home.queryByNameAndPass(username, password);

        await this.checkSingUpResult(res);
    }

    async singInByEmail() {

        const {ctx, service} = this;
        const {email, password, code} = ctx.request.body;

        try {
            await ctx.validate({email}, [emailDes]);
        } catch (e) {

            return ctx.badRequest(email);
        }

        const res = await service.home.queryByEmail({email, password, code});

        await this.checkSingUpResult(res);


    }

    async singInByPhone() {

        const {ctx, service} = this;

        const {phone, password, code} = ctx.request.body;
        try {
            await ctx.validate({phone}, [phoneDes]);
        } catch (e) {
            return ctx.badRequest(phone);
        }

        const res = await service.home.queryByPhone({phone, password, code});

        await this.checkSingUpResult(res);

    }


    private async checkSingUpResult(res: Error | Row<{ id: number, username?: string, email?: string, phone?: string }>) {

        const {app, ctx, service} = this;

        if (res instanceof Error) ctx.failure(res.message);
        else {
            const token = ctx.helper.signToken(res);
            const {id} = res;

            const permissions = await service.user.queryUserPermissionList({id});

            const apiPermissions: PermissionRow[] = [];
            const menuPermissions: PermissionRow[] = [];
            const routePermissions: PermissionRow[] = [];

            permissions.forEach((permission) => {
                const {type} = permission;
                if (type === 'api') apiPermissions.push(permission);
                else if (type === 'menu') menuPermissions.push(permission);
                else routePermissions.push(permission);
            })

            await app.redis.setex(`${id}`, 60 * 60 * 2, JSON.stringify(apiPermissions));
            ctx.success({token, permissions: {menu: menuPermissions, route: routePermissions}});
        }
    }


}