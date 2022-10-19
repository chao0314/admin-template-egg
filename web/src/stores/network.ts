import axios from 'axios';
import {ElMessage} from 'element-plus';
import {locale} from "@/locale/zh-cn";

export const version = 'v1';

const baseURL = 'http://127.0.0.1:7001';

const instance = axios.create({baseURL});


instance.interceptors.request.use(function (config) {

    return config;
}, function (error) {
    // 请求转化的时候可能出错，只要请求发出了，出错都在 response interceptor中解决
    return Promise.reject(error);
});


instance.interceptors.response.use(function (response) {

    const {data: rData} = response;

    const {error, data} = rData;

    if (error) {

        ElMessage({
            type: 'error',
            message: data,
            offset: 100
        })

        throw new Error(data);
    }

    return rData;
}, function (error) {


    const {response} = error;
    let message = locale.requestError;

    if (response && response.data && response.data.error) message = response.data.error;

    ElMessage({
        type: 'error',
        message,
        offset: 100
    })

    return Promise.reject(error);
});

export default instance;


export const createQuery = (obj: Record<string, any>) => {

    let query = ``;

    Object.keys(obj).forEach(key => {

        const value = obj[key];

        if (value !== undefined && value !== '') query += `&${key}=${value}`;

    })

    return query.slice(1);


}