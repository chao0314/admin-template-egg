import {Service} from 'egg';
import user from "../model/user";
import {Locale} from "../../config/locale";

export default class Home extends Service {

    async createUser(username: string, password: string): Promise<Error | undefined> {

        const {ctx} = this;
        const model = user(ctx);
        const passHash = ctx.helper.md5(password);
        const [res] = await model.queryByName(username);
        if (res.length > 0) return new Error(ctx.__(Locale.usernameAlreadyExists));
        await model.createUser({username, password: passHash});

    }

    async createUserByPhone(phone: string, password: string): Promise<Error | undefined> {

        const {ctx} = this;
        const model = user(ctx);
        const [res] = await model.queryByPhone(phone);
        const passHash = ctx.helper.md5(password);
        if (res.length > 0) return new Error(ctx.__(Locale.phoneAlreadyExists));
        await model.createByPhone({phone, password: passHash});

    }

    async creatUserByEmail(email: string, password: string): Promise<Error | undefined> {

        const {ctx} = this;
        const model = user(ctx);
        const [res] = await model.queryByEmail(email);
        const passHash = ctx.helper.md5(password);
        if (res.length > 0) return new Error(ctx.__(Locale.emailAlreadyExists));
        await model.createByEmail({email, password: passHash});
    }

    async queryByNameAndPass(username:string,password:string):Promise<Error|{token:string}>{

        const {ctx} =  this;
        const model =  user(ctx);
        const passHash = ctx.helper.md5(password);
        const [res] = await model.queryByNameAndPass({username,password:passHash});

        if(res.length===0) return new Error(ctx.__(Locale.errorOfUsernameOrPassword));


    }

}