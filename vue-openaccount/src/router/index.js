import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      component: resolve => require(['../pages/Main.vue'], resolve),
      children: [{
        path: '/',
        component: resolve => require(['../pages/Home.vue'], resolve),
        name: '首页'
      }]
    }
  ]
})
