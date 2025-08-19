import { useTabStore } from '@/stores/tabStore';
import { useMenuStore } from '@/stores/menuStore'
import { useUserStore } from '@/stores/userStote'
import { createRouter, createWebHistory } from 'vue-router'

// 基础路由（不需要权限的路由）
const baseRoutes = [
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
    path: '/',
    name: 'Main',
    component: () => import('@/views/Main/index'),
    meta: {
      title: '首页',
      icon: 'House',
      visible: true,
      keepTab: true
    }
  },
]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: baseRoutes
})

// 全局前置守卫
router.beforeEach(async (to, from, next) => {
  const userStore = useUserStore()
  const menuStore = useMenuStore()
  const tabStore = useTabStore()


  // 不需要登录的页面列表
  const publicPages = ['/login', '/']
  const isPublicPage = publicPages.includes(to.path)

  if (!userStore.isLoggedIn) {
    tabStore.closeAllTabs()
  }

  // 如果是公开页面，直接放行
  if (isPublicPage) {
    // 如果是已登录用户访问登录页，重定向到首页
    if (to.path === '/login' && userStore.isLoggedIn) {
      next('/')
      return
    }

    // 如果用户已登录且访问首页，确保动态路由已加载（为了侧边栏菜单显示）
    // 使用 menuStore.menuList.length 来判断是否已加载菜单
    if (to.path === '/' && userStore.isLoggedIn && menuStore.menuList.length === 0) {
      try {
        await menuStore.getMenuList(router, userStore.getUserId())
      } catch (error) {
        console.error('加载菜单失败:', error)
        // 即使菜单加载失败，首页仍然可以访问
      }
    }

    next()
    return
  }

  // 需要权限的页面，检查登录状态
  if (!userStore.isLoggedIn) {
    next(`/login?redirect=${encodeURIComponent(to.fullPath)}`)
    return
  }

  // 已登录用户访问需要权限的页面
  // 使用 menuStore.menuList.length 来判断是否已加载菜单
  if (userStore.isLoggedIn && menuStore.menuList.length === 0) {
    try {
      await menuStore.getMenuList(router, userStore.getUserId())
      // 重新导航到目标路由
      next({ ...to, replace: true })
    } catch (error) {
      console.error('加载菜单失败:', error)
      // 清除登录状态，重新登录
      userStore.logout()
      next('/login')
    }
    return
  }

  next()
})

export default router