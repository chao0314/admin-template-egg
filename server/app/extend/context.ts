import {Context} from "egg";
import {Descriptor} from "../../lib/plugin/egg-validator";

export default {

    success(this: Context, data: any = 'success') {

        this.status = 200;
        this.body = {
            error: null,
            data
        }

    },

    failure(this: Context, data: any = 'failure') {

        this.status = 200;
        this.body = {
            error: 'Failure',
            data

        }

    },

    error(this: Context, error?: Error) {

        this.status = 500;
        console.error('Server Internal Error!', error);
        this.body = {
            error: 'Server Internal Error!'
        }

    },

    badRequest(this: Context, params: string = '') {

        this.status = 400;
        this.body = {
            error: 'Bad Request!',
            message: params
        }

    },

    unauthorized(this: Context) {

        this.status = 401;
        this.body = {
            error: 'Unauthorized!'
        }

    },

    forbidden(this: Context) {

        this.status = 403;
        this.body = {
            error: 'Forbidden!'
        }

    },
    async validate(this: Context, data: Record<string, any>, descriptors: Descriptor[]) {
        const {app} = this;
        const des = Object.assign({}, ...descriptors);
        const validator = app.validator(des);
        await validator.validate(data);

    }


}