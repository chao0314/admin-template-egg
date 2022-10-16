import {Context} from "egg";
import {Descriptor} from "../../lib/plugin/egg-validator";
import {Locale} from '../../config/locale';

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
            error: this.__(Locale.failure),
            data

        }

    },

    error(this: Context, error?: Error) {

        this.status = 500;
        console.error('Server Internal Error!', error);
        this.body = {
            error: this.__(Locale.serverInternalError)
        }

    },

    badRequest(this: Context, params: string = '') {

        this.status = 400;
        this.body = {
            error: this.__(Locale.badRequest),
            message: params
        }

    },

    unauthorized(this: Context) {

        this.status = 401;
        this.body = {
            error: this.__(Locale.unauthorized)
        }

    },

    forbidden(this: Context) {

        this.status = 403;
        this.body = {
            error: this.__(Locale.forbidden)
        }

    },
    async validate(this: Context, data: Record<string, any>, descriptors: Descriptor[]) {
        const {app} = this;
        const des = Object.assign({}, ...descriptors);
        const validator = app.validator(des);
        await validator.validate(data);

    }


}