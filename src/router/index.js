import Vue from 'vue'
import VueRouter from 'vue-router'
Vue.use(VueRouter)
const routes = [{
    path: '/login',
    name: 'login',
    component: () => import('../views/login/')
  },

  {
    path: '/',
    component: () => import('../views/layout/'),
    children: [{
        path: '', //path为空会作为默认子路由渲染
        component: () => import('../views/home/'),
      },
      {
        path: 'article', //path为空会作为默认子路由渲染
        component: () => import('../views/article/'),
      },
      {
        path: 'comment', //path为空会作为默认子路由渲染
        component: () => import('../views/comment/'),
      },
      {
        path: 'fans', //path为空会作为默认子路由渲染
        component: () => import('../views/fans/'),
      },
      {
        path: 'image', //path为空会作为默认子路由渲染
        component: () => import('../views/image/'),
      },
      {
        path: 'publish', //path为空会作为默认子路由渲染
        component: () => import('../views/publish/'),
      },
      {
        path: 'settings', //path为空会作为默认子路由渲染
        component: () => import('../views/settings/'),
      },

    ]
  },

]

const router = new VueRouter({
  routes
})

export default router