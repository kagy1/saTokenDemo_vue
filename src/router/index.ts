import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      name: 'Main',
      path: '/Main',
      redirect: '/Main/index',
      meta: {
        title: 'Main',
      },
      children: [
        {
          path: '/Main/index',
          name: 'index',
          component: () => import('@/views/Main/index'),
          meta: {
            title: '测试',
            icon: 'User'
          }
        }
      ]
    }, {
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
          }
        }, {
          path: '/Manager/role',
          name: 'role',
          component: () => import('@/views/Manager/RoleManager'),
          meta: { title: '角色管理' }
        }, {
          path: '/Manager/menu',
          name: 'menu',
          component: () => import('@/views/Manager/MenuManager'),
          meta: { title: '菜单管理' }
        }
      ],
      meta: {
        title: '系统管理',
      }
    }
  ],
})

export default router
