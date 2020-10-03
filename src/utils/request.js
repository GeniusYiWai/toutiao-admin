// 请求模块
import axios from 'axios';
import jsonBig from 'json-bigint';
import {
    Message
} from 'element-ui'
import router from '@/router/'
// 在非组件模块中获取store 必须通过这种方式
import store from '@/store/'
const request = axios.create({
    baseURL: "http://ttapi.research.itcast.cn/",
    // transformResponse 允许自定义原始的响应数据（字符串）
    transformResponse: [function (data) {
        try {
            // 如果转换成功则返回转换的数据结果
            return jsonBig.parse(data)
        } catch (err) {
            // 如果转换失败，则包装为统一数据格式并返回
            return {
                data
            }
        }
    }]
})
//请求拦截器
request.interceptors.request.use(function (config) {
    //获取vuex中的user信息
    const {
        user
    } = store.state;
    //如果用户已经登录 统一给请求设置token信息

    if (user) {
        //设置token
        config.headers.Authorization = `Bearer ${user.token}`;
    }
    //一定要把config返回
    return config
}, function (error) {
    return Promise.reject(error)
})
//响应拦截器

request.interceptors.response.use(function (response) {
    //响应成功进入这里
    return response
}, async function (error) {

    //任何超过2xx的响应码都会进入这里
    return Promise.reject(error)
})

function refirectLogin() {
    router.replace({
        name: 'login',
        query: {
            // router.currentRoute.fullPath和this.$route是一个东西
            redirect: router.currentRoute.fullPath
        }
    })
}
//导出
export default request;