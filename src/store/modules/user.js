// 用户模块
export default {
  namespaced: true,
  state() {
    return {
      userInfo: {
        token: '',
      },
      uploadInfo: {},
      recommendCode: '', // 通过分享进入的分享码
    }
  },
  getters: {
    isLogin(state) {
      return !!state.userInfo.token
    },
    isShare(state) {
      return !!state.recommendCode
    },
  },
  mutations: {
    // 修改用户信息  payload就是用户信息对象
    setUser(state, payload) {
      state.userInfo = payload
    },
    setUploadInfo(state, payload) {
      state.uploadInfo = { ...state.uploadInfo, ...payload }
    },
    setRecommendCode(state, payload) {
      state.recommendCode = payload
    },
    logout(state) {
      state.userInfo = {}
      state.uploadInfo = {}
      state.recommendCode = ''
    },
  },
}
