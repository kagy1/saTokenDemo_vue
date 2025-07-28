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
    }
  ],
})

export default router
