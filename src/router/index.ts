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
  }
]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: baseRoutes
})

// 路由加载状态
let dynamicRoutesLoaded = false

// 全局前置守卫
router.beforeEach(async (to, from, next) => {
  const userStore = useUserStore()
  const menuStore = useMenuStore()

  // 先初始化用户信息（从持久化存储中恢复）
  if (!userStore.isLoggedIn) {
    userStore.initUserInfo()
  }

  // 不需要登录的页面列表
  const publicPages = ['/login']
  const isPublicPage = publicPages.includes(to.path)

  if (!isPublicPage && !userStore.isLoggedIn) {
    // 需要登录但未登录，跳转到登录页
    next(`/login?redirect=${encodeURIComponent(to.fullPath)}`)
    return
  }

  if (to.path === '/login' && userStore.isLoggedIn) {
    // 已登录用户访问登录页，重定向到首页
    next('/')
    return
  }

  if (userStore.isLoggedIn && !dynamicRoutesLoaded) {
    // 已登录但还没有加载动态路由
    try {
      await menuStore.getMenuList(router, userStore.getUserInfo().userId)
      dynamicRoutesLoaded = true

      // 如果当前路径是根路径，重定向到第一个有权限的菜单
      if (to.path === '/') {
        const firstMenu = findFirstAvailableMenu(menuStore.menuList)
        if (firstMenu) {
          next(firstMenu.path)
          return
        }
      }

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

// 查找第一个可用的菜单路径
function findFirstAvailableMenu(menuList: any[]): any {
  for (const menu of menuList) {
    if (menu.meta?.visible !== false) {
      if (menu.children && menu.children.length > 0) {
        const childMenu = findFirstAvailableMenu(menu.children)
        if (childMenu) return childMenu
      } else if (menu.component) {
        return menu
      }
    }
  }
  return null
}

// 路由离开时的清理
router.afterEach(() => {
  // 可以在这里做一些清理工作
})

export default router
