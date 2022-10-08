import {Service} from "egg";
import user from '../model/user';
import {Locale} from "../../config/locale";
import {UserInfo, FilterInfo} from "../model/user";

type UserModel = ReturnType<typeof user>;


export default class User extends Service {


    async createUser(payload: UserInfo): Promise<Error | undefined> {

        const {ctx} = this;
        const model = user(ctx);
        payload.password = ctx.helper.md5(payload.password);
        const error = await this.checkUserInfo(model, payload);
        if (error) return error
        await model.createUser(payload);

    }

    async delUser(id: string | number) {

        const {ctx} = this;
        const model = user(ctx);

        await model.delUserById(id);

    }


    async updateUser(payload: UserInfo) {

        const {ctx} = this;
        const model = user(ctx);
        payload.password = ctx.helper.md5(payload.password);
        const error = await this.checkUserInfo(model, payload);
        if (error) return error;

        await model.updateUserById(payload);

    }


    async updateUserState(payload: { id: number, state: 0 | 1 }) {


        const {ctx} = this;
        const model = user(ctx);
        await model.updateUserState(payload);
    }

    async queryUserList(payload: FilterInfo) {

        const {ctx} = this;
        const model = user(ctx);
        const filter: UserInfo = Object.keys(payload).reduce((preObj, curKey) => {

            const value = payload[curKey];
            if (value !== undefined) {

                if (curKey === 'keyword') {
                    preObj.username = value;
                    preObj.email = value;
                    preObj.phone = value;

                } else preObj[curKey] = value;

            }
            return preObj;

        }, {} as UserInfo);

        return await model.queryUserList(filter);


    }

    private async checkUserInfo(model: UserModel, payload: UserInfo): Promise<Error | undefined> {

        const {ctx} = this;
        if (payload.username) {

            const [res] = await model.queryByName(payload.username);

            if (res.length > 0) return new Error(ctx.__(Locale.usernameAlreadyExists));
        }

        if (payload.email) {
            const [res] = await model.queryByEmail(payload.email);
            if (res.length > 0) return new Error(ctx.__(Locale.emailAlreadyExists));
        }
        if (payload.phone) {
            const [res] = await model.queryByPhone(payload.phone);
            if (res.length > 0) return new Error(ctx.__(Locale.phoneAlreadyExists));
        }

    }
}



