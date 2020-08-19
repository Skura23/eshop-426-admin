import request from '@/utils/request'


export function login(data) {
  return request({
    url: '/login',
    method: 'post',
    data
  })
}

export function api(data) {
  return request({
    url: '',
    method: 'post',
    data
  })
}

export function getInfo(token) {
  return request({
    url: '/eshop-426-admin/user/info',
    method: 'get',
    params: { token }
  })
}

export function logout() {
  return request({
    url: '/eshop-426-admin/user/logout',
    method: 'post'
  })
}
