import axios from 'axios'

const http = axios.create({
    baseURL: 'http://www.chenfuguo.cn:8899/api/private/v1',
    timeout: 2000,
});

// 添加请求拦截器
http.interceptors.request.use(config => {
    // 在发送请求之前做些什么
    // const token = localStorage.getItem('token');
    // if (token) {
    //     config.headers.Authorization = token;
    //     return config;
    // }
    return config;
}, error => {
    // 对请求错误做些什么
    return Promise.reject(error);
});

// 添加响应拦截器
http.interceptors.response.use(response => {
    // 对响应数据做点什么
    return response.data;
}, error => {
    // 对响应错误做点什么
    return Promise.reject(error);
});

export default http