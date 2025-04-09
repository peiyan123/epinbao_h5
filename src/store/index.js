import {
  createStore
} from 'vuex'
// vuex 持久化
import createPersistedstate from 'vuex-persistedstate'

// 模块
import user from './modules/user'

// vue 2.0创建仓库 new Vuex.Store({})
// vue 3.0创建仓库 createStore({})
export default createStore({
  modules: {
    user
  },
  // 持久化配置插件
  plugins: [
    createPersistedstate({
      // 本地存储名字
      key: "epb-h5-token",
      // 指定需要存储的模块
      paths: ['user']
    })
  ]
})
