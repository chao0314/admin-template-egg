import {Service} from 'egg';
import user from "../model/user";

export default class Home extends Service {

    async createUser(username: string, password: string): Promise<Error | undefined> {

        const {app, ctx} = this;
        const model = user(app);
        const passHash = ctx.helper.md5(password);
        const [res] = await model.queryByName(username);
        if (res.length > 0) return new Error(ctx.__('usernameAlreadyExists'));
        await model.create(username, passHash);

    }


}