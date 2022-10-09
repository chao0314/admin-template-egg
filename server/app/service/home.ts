import {Service} from 'egg';
import user from "../model/user";
import {Locale} from "../../config/locale";

export default class Home extends Service {

    async createUser(username: string, password: string): Promise<Error | void> {

        const {ctx} = this;
        const model = user(ctx);
        const passHash = ctx.helper.md5(password);
        const [res] = await model.queryByName(username);
        if (res.length > 0) return new Error(ctx.__(Locale.usernameAlreadyExists));
        await model.createUser({username, password: passHash});

    }

    async createUserByPhone(phone: string, password: string): Promise<Error | void> {

        const {ctx} = this;
        const model = user(ctx);
        const [res] = await model.queryByPhone(phone);
        const passHash = ctx.helper.md5(password);
        if (res.length > 0) return new Error(ctx.__(Locale.phoneAlreadyExists));
        await model.createByPhone({phone, password: passHash});

    }

    async creatUserByEmail(email: string, password: string): Promise<Error | void> {

        const {ctx} = this;
        const model = user(ctx);
        const [res] = await model.queryByEmail(email);
        const passHash = ctx.helper.md5(password);
        if (res.length > 0) return new Error(ctx.__(Locale.emailAlreadyExists));
        await model.createByEmail({email, password: passHash});
    }

    async queryByNameAndPass(username: string, password: string): Promise<Error | { username: string }> {

        const {ctx} = this;
        const model = user(ctx);
        const passHash = ctx.helper.md5(password);
        const [res] = await model.queryByNameAndPass({username, password: passHash});

        if (res.length === 0) return new Error(ctx.__(Locale.errorOfUsernameOrPassword));
        return res[0];

    }

    async queryByEmail(payload: { email: string, password?: string, code?: string }): Promise<Error | { email: string }> {

        const {app, ctx} = this;
        const model = user(ctx);
        const {email, password, code} = payload;

        if (password) {
            const passHash = ctx.helper.md5(password);
            const [res] = await model.queryByEmailAndPass({email, password: passHash});
            return (res.length === 0) ? new Error(ctx.__(Locale.errorOfEmailOrPassword)) : res[0];

        } else if (code) {

            const {redis} = app;

            const rCode = await redis.get(email);

            return rCode && rCode === code ? {email} : new Error(ctx.__(Locale.codeExpired));

        } else return new Error(ctx.__(Locale.needPasswordOrCode));


    }

    async queryByPhone(payload: { phone: string, password?: string, code?: string }): Promise<Error | { phone: string }> {

        const {app, ctx} = this;
        const model = user(ctx);
        const {phone, password, code} = payload;

        if (password) {
            const passHash = ctx.helper.md5(password);
            const [res] = await model.queryByPhoneAndPass({phone, password: passHash});
            return res.length === 0 ? new Error(ctx.__(Locale.errorOfPhoneOrPassword)) : res[0];

        } else if (code) {

            const {redis} = app;

            const rCode = await redis.get(phone);

            return rCode && rCode === code ? {phone} : new Error(ctx.__(Locale.codeExpired));

        } else return new Error(ctx.__(Locale.needPasswordOrCode));


    }
}