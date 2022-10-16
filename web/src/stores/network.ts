import axios from 'axios';
import {ElMessage} from 'element-plus';
import {locale} from "@/locale/zh-cn";

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

    const {error} = rData;

    if (error) {

        ElMessage({
            type: 'error',
            message: error,
            offset: 100
        })

        return {};
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