// 请求模块
import axios from 'axios';
import JSONbig from 'json-bigint';
import router from '@/router/'
// 在非组件模块中获取store 必须通过这种方式
import store from '@/store/'
const request = axios.create({
    baseURL: 'http://ttapi.research.itcast.cn/', // 请求的基础路径
    // 定义后端返回的原始数据的处理
    // 参数 data 就是后端返回的原始数据（未经处理的 JSON 格式字符串）
    transformResponse: [function (data) {
        // 后端返回的数据可能不是 JSON 格式字符串
        // 如果不是的话，那么 JSONbig.parse 调用就会报错
        // 所以我们使用 try-catch 来捕获异常，处理异常的发生
        try {
            // 如果转换成功，则直接把结果返回
            return JSONbig.parse(data)
        } catch (err) {
            console.log('转换失败', err)
            // 如果转换失败了，则进入这里
            // 我们在这里把数据原封不动的直接返回给请求使用
            return data
        }

        // axios 默认在内部使用 JSON.parse 来转换处理原始数据
        // return JSON.parse(data)
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