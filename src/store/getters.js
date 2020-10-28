// getters可以认为是 store 的计算属性

const getters = {
  sidebar: state => state.app.sidebar,
  device: state => state.app.device,
  token: state => state.user.token,
  avatar: state => state.user.avatar,
  name: state => state.user.name,
  addRouters: state => state.permission.addRouters,
  hasRole: state => state.permission.hasRole,
  routers: state => state.permission.routers,
}
export default getters
