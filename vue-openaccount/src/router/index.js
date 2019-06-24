import Vue from 'vue'
import Router from 'vue-router'
import { resolve } from 'url';
import { truncate } from 'fs';

Vue.use(Router)

export default new Router({
  routes: [
    {//用户界面
      path: '/',
      redirect: '/login'
    }, {
      path: '/login',
      component: resolve => require(['../pages/Login.vue'], resolve),
      meta:{
        isLogin: false//不需登录即可进入
      },
      name: '登录'
    },{
      path: '/user',
      component: resolve => require(['../components/beforecheckMain.vue'], resolve),
      meta:{
        isLogin: true
      },
      children: [{
        path: '/user/loading',
        component: resolve => require(['../pages/user/beforecheck/loading.vue'], resolve),
        meta:{
          isLogin: true//需要登录
        },
        name: '待审核'
      }, {
        path: '/user/choose',
        component: resolve => require(['../pages/user/beforecheck/choose.vue'], resolve),
        meta:{
          isLogin: true//需要登录
        },
        name: '选择营业网点'
      }, {
        path: '/user/evaluation',
        component: resolve => require(['../pages/user/beforecheck/evaluation.vue'], resolve),
        meta:{
          isLogin: true//需要登录
        },
        name: '风险测评'
      },{
        path: '/user/inputInfo',
        component: resolve => require(['../pages/user/beforecheck/inputInfo.vue'], resolve),
        meta:{
          isLogin: true//需要登录
        },
        name: '填写资料'
      }, {
      path: '/login/warning',
      component: resolve => require(['../pages/user/beforecheck/warning.vue'], resolve),
      meta:{
        isLogin: true//需要登录
      },
      name: '风险提示'
    },{
        path: '/user/chooseBank',
        component: resolve => require(['../pages/user/beforecheck/chooseBank.vue'], resolve),
        meta:{
          isLogin: true//需要登录
        },
        name: '选择银行'
      }]
    }, {
      path: '/user/home',
      component: resolve => require(['../components/Main.vue'], resolve),
      meta:{
        isLogin: true
      },
      children: [{
        path: '/user/home',
        component: resolve => require(['../pages/user/login/myAccounts.vue'], resolve),
        meta:{
          isLogin: true//需要登录
        },
        name: '我的账户'
      }, {
        path: '/user/info',
        component: resolve => require(['../pages/user/login/personalInfo.vue'], resolve),
        meta:{
          isLogin: true//需要登录
        },
        name: '个人信息'
      }, {
        path: '/user/lineDetail',
        component: resolve => require(['../pages/user/login/lineDetail.vue'], resolve),
        meta:{
          isLogin: true//需要登录
        },
        name: '流水明细'
      }]
    },
    //审核员界面
    {
      path: '/reviewer/home',
      component: resolve => require(['../components/reviewerMain.vue'], resolve),
      meta:{
        isLogin: true
      },
      children:[{
        path:'/reviewer/home',
        component: resolve => require(['../pages/reviewer/statisticData.vue'], resolve),
        meta:{
          isLogin: true//需要登录
        },
        name: '统计数据'
      },{
        path:'/reviewer/reviewUser',
        component: resolve => require(['../pages/reviewer/reviewUser.vue'], resolve),
        meta:{
          isLogin: true//需要登录
        },
        name: '开始审核'
      }]
    },
    //管理员界面
    {
      path: '/admin',
      component: resolve => require(['../components/adminMain.vue'], resolve),
      meta:{
        /*isLogin: true*/
      },
      children:[{
        path:'/admin/home',
        component: resolve => require(['../pages/admin/userManagement.vue'], resolve),
        meta:{
          /*isLogin: true*///需要登录
        },
        name: '用户管理'
      },{
        path:'/admin/manageReviewer',
        component: resolve => require(['../pages/admin/reviewerManagement.vue'], resolve),
        meta:{
          isLogin: true//需要登录
        },
        name: '审核员管理'
      }]
    },
    //超级管理员界面
    {
      path: '/superadmin',
      component: resolve => require(['../components/superAdminMain.vue'], resolve),
      meta:{
        /*isLogin: true*/
      },
      children:[{
        path:'/superadmin/home',
        component: resolve => require(['../pages/superAdmin/userManagement.vue'], resolve),
        meta:{
          /*isLogin: true*///需要登录
        },
        name: '用户管理'
      },{
        path:'/superadmin/manageAdmin',
        component: resolve => require(['../pages/superAdmin/adminManagement.vue'], resolve),
        meta:{
          isLogin: true//需要登录
        },
        name: '管理员管理'
      },{
        path:'/superadmin/manageInstitute',
        component: resolve => require(['../pages/superAdmin/instituteManagement.vue'], resolve),
        meta:{
          isLogin: true//需要登录
        },
        name: '机构管理'
      }]
    }
  ]
})
