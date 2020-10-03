// 请求模块
import axios from 'axios';
import jsonBig from 'json-bigint';
import {
    Message
} from 'element-ui'
import router from '@/router/'
// 在非组件模块中获取store 必须通过这种方式
import store from '@/store/'
const refreshToken = axios.create({
    baseURL: "http://ttapi.research.itcast.cn/",
})
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
    const status = error.response.status;
    //客户端请求参数错误
    if (status == 400) {
        Message.fail('请求参数错误');
    }
    //token无效
    if (status == 401) {
        const {
            user
        } = store.state;

        //如果没有user 或者 user.token 直接去登录
        if (!user || !user.token) {
            //跳转到登录页
            return refirectLogin()
        }
        //如果有refresh_token 请求获取新的token
        try {
            const {
                data
            } = await refreshToken({
                method: 'PUT',
                url: '/app/v1_0/authorizations',
                headers: {
                    Authorization: `Bearer ${user.refresh_token}`
                }
            })
            user.token = data.data.token
            store.commit('setUser', user)
            //error.config是本次请求的相关配置信息对象
            return request(error.config)
        } catch (error) {
            //刷新token 失败
            refirectLogin()
        }

        //把新的token更新到容器
        //把失败的请求重新发出去
    }
    //没有权限
    else if (status == 403) {
        Message.fail('没有权限');
    }
    //服务端异常
    else if (status >= 500) {
        Message.fail('服务器错误');

    }
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