import Vue from 'vue'
import VueRouter from 'vue-router'
Vue.use(VueRouter)
const routes = [
  // {
  //   path: '/about',
  //   name: 'About',
  //   component: () => import('../views/Index.vue')
  // }
]

const router = new VueRouter({
  routes
})

export default router