import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      redirect: '/login'
    }, {
      path: '/login',
      component: resolve => require(['../pages/Login.vue'], resolve)
    }, {
      path: '/user/home',
      component: resolve => require(['../components/Main.vue'], resolve),
      children: [{
        path: '/user/home',
        component: resolve => require(['../pages/login/myAccounts.vue'], resolve),
        name: '我的账户'
      }, {
        path: '/user/info',
        component: resolve => require(['../pages/login/personalInfo.vue'], resolve),
        name: '个人信息'
      }]
    }
  ]
})
