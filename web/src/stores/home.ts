import {defineStore} from "pinia";
import instance from "@/stores/network";
import {ref} from "vue";


export const useHomeStore = defineStore('home', () => {

    const tokenRef = ref<string>();


    const getCaptchaAction = async () => {

        return await instance.get('/captcha', {withCredentials: true});
    }

    const verifyCaptchaAction = async (payload: { captcha: string }) => {

        return await instance.post('/captcha', payload, {withCredentials: true});
    }


    const sendSmsAction = async (payload: { phone: string }) => {

        return await instance.get(`/sms?phone=${payload.phone}`);
    }

    const sendMailAction = async (payload: { to: string }) => {

        return await instance.get(`/mail?to=${payload.to}`);

    }

    const singUpAction = async (payload: { username: string, password: string }) => {

        return await instance.post('/sing-up', payload);
    }

    const singUpPhoneAction = async (payload: { phone: string, password: string, code: string }) => {

        return await instance.post('/sing-up-phone', payload);
    }

    const singUpEmailAction = async (payload: { email: string, password: string, code: string }) => {

        return await instance.post('/sing-up-email', payload);
    }


    const singInAction = async (payload: { username: string, password: string }) => {

        const res = await instance.post('/sing-in', payload);
        setToken(res?.data?.token);
        return res;
    }

    const singInEmailAction = async (payload: { email: string, password?: string, code?: string }) => {

        const res = await instance.post('/sing-in-email', payload);
        setToken(res?.data?.token);
        return res;
    }

    const singInPhoneAction = async (payload: { phone: string, password?: string, code?: string }) => {

        const res = await instance.post('/sing-in-phone', payload);
        setToken(res?.data?.token);
        return res;
    }

    const setToken = (token: string) => {

        localStorage.setItem('token', token);
        tokenRef.value = token;
    }

    return {
        tokenRef,
        getCaptchaAction,
        verifyCaptchaAction,
        sendSmsAction,
        sendMailAction,
        singUpAction,
        singUpPhoneAction,
        singUpEmailAction,
        singInAction,
        singInEmailAction,
        singInPhoneAction

    }

})