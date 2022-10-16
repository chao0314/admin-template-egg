import {defineStore} from "pinia";
import instance from "@/stores/network";
import {locale} from "@/locale/zh-cn";


export const useHomeStore = defineStore('home', () => {

    const getCaptchaAction = async ()=> {

        return await instance.get('/captcha');

    }

    const verifyCaptchaAction = async () => {


    }

    const singUpAction = async () => {

    }


    return {
        getCaptchaAction
    }

})