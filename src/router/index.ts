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
        keepTab: true,
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

export default router
