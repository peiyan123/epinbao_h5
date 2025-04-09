import store from '@/store'

const authRoute = ['/home']
export function createPermissionGuard(router) {
  router.beforeEach((to, from, next) => {
    const isLogin = store.getters['user/isLogin']
    console.log('isLogin', isLogin)
    if (authRoute.includes(to.path)) {
      if (isLogin) {
        return next()
      } else {
        return next('/login')
      }
    }
    next()
  })
}
