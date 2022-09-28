import {Controller} from 'egg';
import {emailDes, phoneDes, usernameDes, passwordDes, ValidateError} from "../descriptor";

export default class HomeController extends Controller {
    public async index() {
        const {ctx} = this;

        ctx.body = await ctx.service.test.sayHi('egg');
    }

    async getCaptcha() {

        const {app, ctx} = this;
        const {data, text} = this.app.createCaptcha();
        const uid = this.ctx.helper.uuid();
        app.redis.setex(uid, 60, text);
        ctx.cookies.set('uid', uid, {maxAge: 60 * 1000 * 2});
        ctx.success(data);

    }

    async verifyCaptcha() {

        const {app, ctx} = this;
        const captcha = ctx.request.body.captcha;
        const uid = ctx.cookies.get('uid');
        const rCaptcha = await app.redis.get(uid);
        ctx.success(captcha && rCaptcha && rCaptcha === captcha);

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
            const name = '测试';
            const code = ctx.helper.randomHex(4);
            const body = {
                subject: ctx.__('emailCode'),
                text: ctx.__("email %s Text %s", name, code)
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
            const code = ctx.helper.randomHex(4);

            await app.sendSms(phoneNum, [code, '5']);

            app.redis.setex(phoneNum, 60 * 5, code);
        }

        ctx.success();

    }

    async singUpEmail() {
        const {app, ctx} = this;
        const {email, code} = ctx.request.body;
        const rCode = await app.redis.get(email);
        if (code && rCode && rCode === code) {
            //todo
            console.log('sing up email');
            console.log(email);

            ctx.success();
        } else ctx.failure(ctx.__('codeExpired'));


    }

    async singUpPhone() {

        const {app, ctx} = this;

        const {phone, code} = ctx.request.body;

        const rCode = await app.redis.get(phone);

        if (code && rCode && code === rCode) {
            //todo...
            console.log('sing up phone');
            console.log(phone);

            ctx.success();
        } else ctx.failure(ctx.__('codeExpired'));

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

        const res = await service.home.createUser(username, password);

        if (res) ctx.failure(res.message)

        else ctx.success();


    }
}
