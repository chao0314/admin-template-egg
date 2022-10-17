import {defineStore} from "pinia";
import instance from "@/stores/network";


export const useHomeStore = defineStore('home', () => {

    const getCaptchaAction = async () => {

        return await instance.get('/captcha', {withCredentials: true});
    }

    const verifyCaptchaAction = async (payload: { captcha: string }) => {

        return await instance.post('/captcha', payload, {withCredentials: true});
    }

    const singUpAction = async (payload: { username: string, password: string }) => {

        return await instance.post('/sing-up', payload);
    }

    const singUpPhoneAction = async (payload: { phone: string, password: string }) => {

        return await instance.post('/sing-up-phone', payload);
    }

    const singUpEmailAction = async (payload: { email: string, password: string }) => {

        return await instance.post('/sing-up-email', payload);
    }


    return {
        getCaptchaAction,
        verifyCaptchaAction,
        singUpAction,
        singUpPhoneAction,
        singUpEmailAction

    }

})