import type {FormRules} from "element-plus";
import {inject} from 'vue';
import type {Locale} from "@/locale/zh-cn";

let locale: Locale = {} as Locale;

const rules: FormRules = {
    username: {
        type: 'string',
        required: true,
        pattern: /^\w+$/g,
        message: () => locale?.checkUsername

    },
    password: {
        type: "string",
        required: true,
        pattern: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)\w{6,10}$/g,
        message: () => locale?.checkPassword

    },
    verificationCode: {
        type: "string",
        required: true,
        len: 4,
        message: () => locale?.checkCode
    },
    account: {
        type: "string",
        required: true,
        message: () => locale?.checkAccount
    },
    dynamicCode: {
        type: "string",
        required: true,
        len: 4,
        message: () => locale?.checkCode
    },
    email: {
        type: 'email',
        required: true,
        message: () => locale?.checkEmail
    },
    phone: {
        type: 'string',
        required: true,
        pattern: /^(\+86|86)?\d{11}$/g,
        message: () => locale?.checkPhone
    }

};


const useRules = () => {

    locale = inject<Locale>('locale', {} as Locale);

    return rules;

}

export default useRules;