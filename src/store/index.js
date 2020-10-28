import Vue from 'vue'
import Vuex from 'vuex'
import getters from './getters'
import app from './modules/app'
import settings from './modules/settings'
import permission from './modules/permission'
import user from './modules/user'

Vue.use(Vuex)

// 提供获取其他模块store的索引
const store = new Vuex.Store({
  modules: {
    app,
    settings,
    permission,
    user
  },
  getters
})

export default store
