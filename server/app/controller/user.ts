import {Controller} from "egg";
import {usernameDes, emailDes, phoneDes, passwordDes, mergeDes, ValidateError} from "../descriptor";

export default class HomeController extends Controller {

    async createUser() {
        const {ctx, service} = this;
        const {username, email, phone, password,} = ctx.request.body;

        const emailDesTemp = mergeDes(emailDes, {email: {required: false}});
        const phoneDesTemp = mergeDes(phoneDes, {phone: {required: false}});

        try {

            await ctx.validate({
                username,
                email,
                phone,
                password
            }, [usernameDes, emailDesTemp, phoneDesTemp, passwordDes]);

        } catch (e: unknown) {

            return ctx.badRequest((e as ValidateError).errors[0].fieldValue);
        }

        const error = await service.user.createUser({username, email, phone, password});

        if (error instanceof Error) ctx.failure(error.message);
        else ctx.success();


    }

}