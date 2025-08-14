import { useUserStore } from '@/stores/userStote'
import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'Main',
      component: () => import('@/views/Main/index'),
      meta: {
        title: '首页',
        icon: 'House',
        keepTab: true
      }
    },
    {
      path: '/login',
      name: 'login',
      component: () => import('@/views/login/index.vue'),
      meta: {
        title: '登录',
        icon: 'House',
        keepTab: false,
        visible: false
      }
    },
    {
      name: 'TestDemo',
      path: '/TestDemo',
      redirect: '/TestDemo/axiosTest',
      meta: {
        title: '测试',
        icon: 'User'
      },
      children: [
        {
          path: '/TestDemo/axiosTest',
          name: 'axiosTest',
          component: () => import('@/views/TestDemo/axiosTest'),
          meta: {
            title: '测试',
            icon: 'User'
          }
        }
      ]
    },
    {
      path: '/Manager',
      name: 'Manager',
      redirect: '/Manager/user',
      children: [
        {
          path: '/Manager/user',
          name: 'user',
          component: () => import('@/views/Manager/UserManager'),
          meta: {
            title: '用户管理',
            icon: 'User'
          }
        }, {
          path: '/Manager/role',
          name: 'role',
          component: () => import('@/views/Manager/RoleManager'),
          meta: { title: '角色管理', icon: 'User' }
        }, {
          path: '/Manager/menu',
          name: 'menu',
          component: () => import('@/views/Manager/MenuManager'),
          meta: { title: '菜单管理', icon: 'User' }
        }
      ],
      meta: {
        title: '系统管理',
        icon: 'User'
      }
    }
  ],
})


// 全局前置守卫
router.beforeEach((to, from, next) => {
  const userStore = useUserStore()

  // 不需要登录的页面列表
  const publicPages = ['/login']
  const isPublicPage = publicPages.includes(to.path)

  if (!isPublicPage && !userStore.isLoggedIn) {
    // 需要登录但未登录，跳转到登录页，并保存当前要访问的页面
    next(`/login?redirect=${to.fullPath}`)
  } else if (to.path === '/login' && userStore.isLoggedIn) {
    // 已登录用户访问登录页，重定向到首页
    next('/')
  } else {
    next() // 允许访问
  }
})

export default router
