import {Descriptor,} from "../../lib/plugin/egg-validator";

export {ValidateError} from "../../lib/plugin/egg-validator";
export const emailDes: Descriptor = {
    email: {
        type: 'email',
        required: true
    }
}

export const phoneDes: Descriptor = {

    phone: {
        type: 'string',
        required: true,
        pattern: /^(\+86|86)?\d{11}$/g
    }
}
