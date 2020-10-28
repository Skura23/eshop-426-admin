import Cookies from 'js-cookie'

const TokenKey = 'eshop-426-admin_token'
const UserinfoKey = 'eshop-426-admin_userinfo'
const MenulistKey ='eshop-426-admin_menulist'

export function getToken() {
  return Cookies.get(TokenKey)
}

export function setToken(token) {
  return Cookies.set(TokenKey, token)
}

export function removeToken() {
  return Cookies.remove(TokenKey)
}

export function removeUserinfo() {
  return Cookies.remove(UserinfoKey)
}

export function removeMenulist() {
  return localStorage.removeItem(MenulistKey)
}

