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
// 路由导航守卫：说白了所有页面的导航都会经过这里
// 守卫页面的导航的
// to：要去的路由信息
// from：来自哪里的路由信息
// next：放行方法
router.beforeEach((to, from, next) => {
  const user = JSON.parse(window.localStorage.getItem('user'))
  // 校验非登录页面的登录状态
  if (to.path !== '/login') {
    if (user) {
      // 已登录，允许通过
      next()
    } else {
      // 没有登录，跳转到登录页面
      next('/login')
    }
  } else {
    // 登录页面，正常允许通过
    next()
  }
})

export default router