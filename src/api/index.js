/* eslint-disable no-console */
import axios from 'axios'
import qs from 'qs'
import NProgress from 'nprogress' // 引入nprogress插件
import 'nprogress/nprogress.css' // 这个nprogress样式必须引入
import ElementUI from "element-ui";
import Router from '@/router/index'
import delCookie from '@/components/header.vue';

axios.defaults.baseURL = process.env.VUE_APP_BASE_API
// 环境切换
// if (process.env.NODE_ENV === 'development') {
//   axios.defaults.baseURL = 'https://official.cdhengsu.com'
//   // console.log('开发环境api接口url')
// } else if (process.env.NODE_ENV === 'test') {
//   axios.defaults.baseURL = 'https://official.cdhengsu.com'
//   // console.log('测试环境api接口url')
// } else if (process.env.NODE_ENV === 'production') {
//   axios.defaults.baseURL = 'https://official.cdhengsu.com'
//   // console.log('设置生产环境api接口url')
// }

// 请求超时时间
axios.defaults.timeout = 10000

// post请求头
axios.defaults.headers.post['Content-Type'] = 'application/json;charset-UTF-8'
axios.defaults.headers.put['Content-Type'] = 'application/json;charset-UTF-8'

// axios请求拦截器
axios.interceptors.request.use((config) => {
  NProgress.start() // 设置加载进度条(开始..)
  // 获取token
  const token = window.localStorage.getItem('access_token')
  // 在请求头中携带token
  config.headers.token = `${token}`
  return config
})

// axios响应拦截器
axios.interceptors.response.use(
  function (response) {
    // if (response.code == 401 && response.msg == '账号在其他地方登录') {
    //   ElementUI.Message({
    //     message: "账号在其他地方登录，请重新登陆！",
    //     type: 'error'
    //   });
    //   Router.push({
    //     name: 'login'
    //   })
    // }
    NProgress.done() // 设置加载进度条(结束..)
    return response
  },
  function (error) {
    if (error.response.data.code == "401") {
      ElementUI.Message({
        message: "账号在其他地方登录，请重新登陆！",
        type: 'error',
      });
      //清除 localStorage
      window.localStorage.clear();
      Router.push({
        name: 'login'
      });
    }

    return Promise.reject(error)
  }
)

// 封装get方法 和 post方法
export function get(url, params) {
  return new Promise((resolve, reject) => {
    axios.get(url, {
        params: params
      })
      .then(res => {
        resolve(res.data)
      })
      .catch(err => {
        reject(err.data)
      })
  })
}

export function deleteW(url, params) {
  return new Promise((resolve, reject) => {
    axios.delete(url, qs.stringify(params))
      .then(res => {
        resolve(res.data)
      })
      .catch(err => {
        reject(err.data)
      })
  })
}

export function post(url, params) {
  return new Promise((resolve, reject) => {
    axios.post(url, JSON.stringify(params))
      .then(res => {
        resolve(res.data)
      })
      .catch(err => {
        reject(err.data)
      })
  })
}

export function addPost(url, params) {
  return new Promise((resolve, reject) => {
    axios.post(url, JSON.stringify(params))
      .then(res => {
        resolve(res.data)
      })
      .catch(err => {
        reject(err.data)
      })
  })
}

export function deletePost(url, params) {
  return new Promise((resolve, reject) => {
    axios.post(
        url,
        qs.stringify(params), {
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
          }
        }
      )
      .then(res => {
        resolve(res.data)
      })
      .catch(err => {
        reject(err.data)
      })
  })
}

export function put(url, params) {
  return new Promise((resolve, reject) => {
    axios.put(url, JSON.stringify(params))
      .then(res => {
        resolve(res.data)
      })
      .catch(err => {
        reject(err.data)
      })
  })
}
export function put2(url, params) {
  return new Promise((resolve, reject) => {
    axios.put(url, params)
      .then(res => {
        resolve(res.data)
      })
      .catch(err => {
        reject(err.data)
      })
  })
}


export function put3(url, params) {
  return new Promise((resolve, reject) => {
    axios.put(
        url,
        qs.stringify(params), {
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
          }
        }
      )
      .then(res => {
        resolve(res.data)
      })
      .catch(err => {
        reject(err.data)
      })
  })
}