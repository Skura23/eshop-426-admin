import axios from 'axios'

import store from '@/store'
import {
  getToken
} from '@/utils/auth'

import {
  MessageBox,
  Message
} from 'element-ui'

import qs from 'qs';

import baseUrl from "@/utils/globals";


// create an axios instance
const service = axios.create({
  baseURL: baseUrl.curBaseUrl, // url = base url + request url
  // withCredentials: true, // send cookies when cross-domain requests
  timeout: 5000 // request timeout
})

// request interceptor
service.interceptors.request.use(
  config => {
    // do something before request is sent
    console.log(config, 'config');
    if (config.url === '/login') {
      // 登录接口
      config.baseURL = baseUrl.loginBaseUrl
    } else {
      // 非登录接口
      config.baseURL = baseUrl.apiBaseUrl
      if (config.data.info) {
        // 兼容老的请求方式, 传参带info键
        config.data = {
          ...config.data,
          ...{
            "v": "v1.0.0",
            "token": getToken()
          }
        }
      } else {
        // 新请求方式, 传参不带info键
        config.data = {
          apiName: config.data.apiName,
          info:{
            ...config.data,
            apiName: undefined
          },
          ...{
            "v": "v1.0.0",
            "token": getToken()
          }
        }
      }
    }

    config.data = qs.stringify({
      info: JSON.stringify(config.data)
    })
    // if (store.getters.token) {
    //   // let each request carry token
    //   // ['X-Token'] is a custom headers key
    //   // please modify it according to the actual situation
    //   config.headers['X-Token'] = getToken()
    // }
    return config
  },
  error => {
    // do something with request error
    console.log(error) // for debug
    return Promise.reject(error)
  }
)

// response interceptor
service.interceptors.response.use(
  /**
   * If you want to get http information such as headers or status
   * Please return  response => response
   */

  /**
   * Determine the request status by custom code
   * Here is just an example
   * You can also judge the status by HTTP Status Code
   */
  response => {
    const res = response.data

    // if the custom code is not 20000, it is judged as an error.
    if (res.code !== 9999) {
      // Message({
      //   message: res.message || 'Error',
      //   type: 'error',
      //   duration: 5 * 1000
      // })

      // 50008: Illegal token; 50012: Other clients logged in; 50014: Token expired;
      if (res.code === 9998) {
        // to re-login
        MessageBox.confirm('登录过期, 请重新登录', '重新登录', {
          confirmButtonText: '重新登录',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          store.dispatch('user/resetToken').then(() => {
            location.reload()
          })
        })
      }
      // return Promise.reject(new Error(res.message || 'Error'))
    }
    return res
  },
  error => {
    console.log('err' + error) // for debug
    Message({
      message: error.message,
      type: 'error',
      duration: 5 * 1000
    })
    return Promise.reject(error)
  }
)

export default service