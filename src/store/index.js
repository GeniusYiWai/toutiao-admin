import Vue from 'vue'
import Vuex from 'vuex'

import {
  getItem,
  setItem
} from '@/utils/storage'
Vue.use(Vuex)
//防止出错 将本地存储名称设置为常量
const USER_KEY = 'user'
export default new Vuex.Store({
  state: {
    //当前登录用户的登录状态 token等数据
    user: getItem(USER_KEY),
  },
  mutations: {
    setUser(state, data) {
      //为了防止刷新数据丢失 需要把数据存储到本地存储
      state.user = data;
      setItem(USER_KEY, data)
    },
  },

})