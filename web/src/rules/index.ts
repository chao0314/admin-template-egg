import type {FormRules} from "_element-plus@2.2.16@element-plus";
import {inject} from 'vue';
import type {Locale} from "@/locale/zh-cn";

let locale: Locale = {} as Locale;

const index: FormRules = {
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
    }

};


const useRules = () => {

    locale = inject<Locale>('locale', {} as Locale);

    return index;

}

export default useRules;
