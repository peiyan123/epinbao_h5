import { createRouter, createWebHistory } from 'vue-router'
import { createPermissionGuard } from './permissionGuard'
// 路由规则
const routes = [
  {
    path: '/',
    redirect: '/home',
  },
  {
    path: '/home',
    name: 'home',
    component: () => import('@/views/home/index.vue'),
  },
  {
    path: '/detail',
    name: 'detail',
    component: () => import('@/views/home/detail.vue'),
  },
  {
    path: '/login',
    name: 'login',
    component: () => import('@/views/login/index.vue'),
  },
  {
    path: '/register',
    name: 'register',
    component: () => import('@/views/register/index.vue'),
  },
  {
    path: '/resume',
    name: 'Resume',
    component: () => import('@/views/resumeInfo/index.vue'),
  },
  {
    path: '/talent',
    name: 'Talent',
    component: () => import('@/views/talent/index.vue'),
  },
  {
    path: '/delivered',
    name: 'Delivered',
    component: () => import('@/views/delivered/index.vue'),
  },
  // {
  //   path: '/personalCenter',
  //   name: 'personalCenter',
  //   component: () => import('@/views/personalCenter/personalCenter.vue'),
  // },
  // {
  //   path: '/positionSquare',
  //   name: 'positionSquare',
  //   component: () => import('@/views/positionSquare/positionSquare.vue'),
  // },
  // {
  //   path: '/positionDetail',
  //   name: 'positionDetail',
  //   component: () => import('@/views/positionSquare/model/positionDetail.vue'),
  // },
  // {
  //   path: '/sendResume',
  //   name: 'sendResume',
  //   component: () => import('@/views/positionSquare/model/sendResume.vue'),
  // },
]

// vue2.0 new VueRouter({}) 创建路由实例
// vue3.0 createRouter({}) 创建理由实例
const router = createRouter({
  // 使用hash的路由模式
  history: createWebHistory(),
  routes,
})

createPermissionGuard(router)

export default router
