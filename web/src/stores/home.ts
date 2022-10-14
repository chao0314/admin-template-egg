import {defineStore} from "pinia";
import instance from "@/stores/network";
import {locale} from "@/locale/zh-cn";


export const useHomeStore = defineStore('home', () => {

    const getCaptchaAction = async () => {


        // const res = await instance.get('/captcha');
        const res = await instance.get('/v1/permissions');
        console.log('captcha---', res);
    }

    const verifyCaptchaAction = async () => {


    }

    const singUpAction = async () => {

    }


    return {
        getCaptchaAction,
    }

})