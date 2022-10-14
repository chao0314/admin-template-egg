import axios from 'axios';
import {ElMessage} from 'element-plus';
import {locale} from "@/locale/zh-cn";

const baseURL = 'http://127.0.0.1:7000';

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
            message: `action 111`,
            offset: 100
        })
    }


    return data;
}, function (error) {


    ElMessage({
        type: 'error',
        message: locale.requestError,
        offset: 50
    })

    return Promise.reject(error);
});

export default instance;