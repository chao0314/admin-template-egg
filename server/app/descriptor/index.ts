import {Descriptor} from "../../lib/plugin/egg-validator";

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

export const usernameDes: Descriptor = {

    username: {
        type: 'string',
        required: true,
        pattern: /^\w{1,16}$/g,
    }
}



export const passwordDes: Descriptor = {

    password: {
        type: "string",
        required: true,
        pattern: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)\w{6,10}$/g
    }
}

export const mergeDes = (des: Descriptor, merged: Descriptor): Descriptor => {

    return Object.assign({}, des, merged)

}