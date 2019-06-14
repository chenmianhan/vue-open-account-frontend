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
      path: '/user',
      component: resolve => require(['../components/unloginMain.vue'], resolve),
      children: [{
        path: '/user/loading',
        component: resolve => require(['../pages/user/unlogin/loading.vue'], resolve),
        name: '待审核'
      }]
    }, {
      path: '/user/home',
      component: resolve => require(['../components/Main.vue'], resolve),
      children: [{
        path: '/user/home',
        component: resolve => require(['../pages/user/login/myAccounts.vue'], resolve),
        name: '我的账户'
      }, {
        path: '/user/info',
        component: resolve => require(['../pages/user/login/personalInfo.vue'], resolve),
        name: '个人信息'
      }, {
        path: '/user/lineDetail',
        component: resolve => require(['../pages/user/login/lineDetail.vue'], resolve),
        name: '流水明细'
      }]
    }
  ]
})
