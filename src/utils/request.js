// 1.初始化axios实例
// 2.请求拦截器，带token
// 3.响应拦截器，拿出响应数据，拦截token失效
// 4.定义一个函数使用配置好的axios发请求

// 1.创建一个新的axios实例
// 2.请求拦截器，如果有token进行头部携带
// 3.响应拦截器：1.剥离无效数据 2.处理token失效
// 4.导出一个函数，调用当前的axios实例发请求，返回promise

import axios from 'axios'
import store from '@/store'
import router from '@/router'
import { Toast } from 'vant'
import AxiosCanceler from '@/utils/axiosCancel'

// 导出基准地址  原因：其他地方不是通过axios发请求的地方用上基准地址
// export const baseURL = 'http://192.168.55.119/epinbao-boot'
// export const baseURL = 'http://10.4.196.218:8810/'
export const baseURL = 'http://192.168.87.40:14617/epinbao-boot/'
// export const baseURL = 'https://saas.epinbao.com/epinbao-boot/'
// export const baseURL = '/api'

const instance = axios.create({
  // axios的 一些配置：baseURL timeout
  baseURL,
  timeout: 20000,
})

instance.interceptors.request.use(
  (config) => {
    // 拦截业务逻辑
    // 进行请求配置的修改
    // 如果本地有token就在头部携带
    // 1.获取用户信息
    const { userInfo } = store.state.user
    // 2.判断是否有token
    if (userInfo.token) {
      // 3.设置token
      config.headers['X-Access-Token'] = userInfo.token
    }
    const axiosCanceler = new AxiosCanceler()
    axiosCanceler.addPending(config)
    return config
  },
  (err) => {
    return Promise.reject(err)
  },
)

// res => res.data 取出data数据，将来调用接口的时候直接拿到的就是后台的数据
instance.interceptors.response.use(
  (res) => {
    return res.data
  },
  (err) => {
    // err.response.data.message: "登录失效，请重新登录"，进入该函数
    if (err.response && err.response.data.message === '登录失效，请重新登录') {
      // 1.清空无效用户信息
      // 2.跳转到登录页码
      // 3.跳转需要传参(当前路由地址)给登录页码
      store.commit('user/logout')
      // 当前路由地址
      // 组件里头：`/user?a=10` $route.path === /user $route.fullPath === /user?a=10
      // js模块中：router.currentRoute.value.fullPath 就是当前路由地址
      // router.currentRoute 是ref响应式
      // console.log(router.currentRoute.value.fullPath, '===');
      const fullPath = encodeURIComponent(router.currentRoute.value.fullPath)
      // encodeURIComponent 转换Url编码，防止解析地址出问题
      router.push('/login?redirectUrl=' + fullPath)
    } else {
      // console.log('err.response?.data?.error', err.response?.data)
      const msg = err.response?.data?.error?.message ?? ''
      msg && Toast(msg)
    }
    return Promise.reject(err)
  },
)

// 请求工具函数
export default (url, method, submitData) => {
  // 负责发请求：请求地址，请求方式，提交的数据
  return instance({
    url,
    method,
    // 1.如果是get请求 需要使用params来传递submitData  ?a=10&c=10
    // 2.如果不是get请求 需要使用data来传递submitData  请求体传参
    // []设置一个动态的key 写js表达式 js表达式的执行结果当做key
    // method参数：get,Get,GET 转换成小写再判断
    [method.toLowerCase() === 'get' ? 'params' : 'data']: submitData,
  })
}

export { instance }
