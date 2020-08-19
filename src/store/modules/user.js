import {
  login,
  api,
  logout,
  getInfo
} from '@/api/user'
import {
  getToken,
  setToken,
  removeToken
} from '@/utils/auth'
import {
  resetRouter
} from '@/router'
import {
  MessageBox,
  Message
} from 'element-ui'
import Cookies from 'js-cookie'

// 用户状态初始化
const getDefaultState = () => {
  return {
    token: getToken(),
    name: '',
    avatar: '',
    selShopPop: false
  }
}

const state = getDefaultState()

const mutations = {
  RESET_STATE: (state) => {
    Object.assign(state, getDefaultState())
  },
  SET_TOKEN: (state, token) => {
    state.token = token
  },
  SET_NAME: (state, name) => {
    state.name = name
  },
  SET_AVATAR: (state, avatar) => {
    state.avatar = avatar
  },
  SET_SEL_SHOP_POP(state, val) {
    state.selShopPop = val
  }
}

const actions = {
  // user login
  login({
    commit
  }, loginDatas) {
    const {
      username,
      password
    } = loginDatas.loginForm
    let {
      vm
    } = loginDatas;
    return new Promise((resolve, reject) => {
      vm.f_selShopPopLoading=true
      login({
        username: username.trim(),
        psd: password,
        factory_id: vm.shopsSelVal
      }).then(response => {
        vm.f_selShopPopLoading=false

        const {
          data
        } = response
        // data.status = 2
        if (response.code == 9999) {
          if (data.status == 1) {
            // commit('SET_NAME', 'test')
            // commit('SET_SEL_SHOP_POP', false)
            commit('SET_TOKEN', data.response.token)
            setToken(data.response.token)
            Cookies.set('eshop-426-admin_userinfo', data.response)
            Message({
              message: response.info,
              type: 'success',
              duration: 1.5 * 1000,
              onClose() {
                vm.$router.push({
                  path: vm.redirect || '/'
                })
              }
            })
          } else if (data.status == 2) {
            commit('SET_SEL_SHOP_POP', true)
            // api({
            //   "apiName": "switch_factory_list|factory"
            // }).then((res) => {
            //   vm.shops = res.data.list
            // })
            vm.shops = data.response
          }
        } else {
          Message({
            message: response.info,
            type: 'error',
            duration: 1.5 * 1000,
            onClose() {

            }
          })
        }

        resolve()
      }).catch(error => {
        vm.f_selShopPopLoading=false
        reject(error)
      })
    })
  },

  // get user info
  getInfo({
    commit,
    state
  }) {
    return new Promise((resolve, reject) => {
      getInfo(state.token).then(response => {
        const {
          data
        } = response

        if (!data) {
          reject('Verification failed, please Login again.')
        }

        const {
          name,
          avatar
        } = data

        commit('SET_NAME', name)
        commit('SET_AVATAR', avatar)
        resolve(data)
      }).catch(error => {
        reject(error)
      })
    })
  },

  // user logout
  logout({
    commit,
    state
  }) {
    return new Promise((resolve, reject) => {
      logout(state.token).then(() => {
        removeToken() // must remove  token  first
        resetRouter()
        commit('RESET_STATE')
        resolve()
      }).catch(error => {
        reject(error)
      })
    })
  },

  // remove token
  resetToken({
    commit
  }) {
    return new Promise(resolve => {
      removeToken() // must remove  token  first
      commit('RESET_STATE')
      resolve()
    })
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}