// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import Vuex from 'vuex'
import App from './App'
import router from './router'

import ElementUI from 'element-ui'
import './assets/theme/element-#2B6AAB/index.css'

import axios from 'axios'
import qs from 'qs'
import store from './store';

Vue.prototype.$Qs = qs;
Vue.prototype.$axios = axios;

axios.defaults.timeout = 30000;

Vue.use(ElementUI);
Vue.config.productionTip = false;

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  store,
  axios,
  components: { App },
  template: '<App/>'
});

// router.beforeEach((to, from, next) => {
//   let getFlag = localStorage.getItem('Flag');//获取用户登录成功后储存的登陆标志
//   let getRole = localStorage.getItem('Role');//获取用户的身份标记

//   //如果登录标志存在且为isLogin,则用户已经登陆
//   if (getFlag === 'isLogin'){
//     //设置vuex登录状态为已登录
//     store.state.isLogin = true;
//     next();
//     //如果已登录，还要选择回到登录界面，则定向回到用户首页
//     if(!to.meta.isLogin){
//       ElementUI.Message({//消息提示退出登录
//         showClose: true,
//         message: "请先退出登录！",
//         duration: 5000,
//         type: 'error'
//       });

//       switch(getRole){//根据身份标识跳转
//         case '0':
//           next({ path: '/user/home'});
//           break;
//         case '1':
//           next({ path: '/reviewer/home'});//审核员界面待添加
//           break;
//         case '2':
//           next({ path: '/admin/home'});
//           break;
//         case '3':
//           next({ path: '/superadmin/home'})//超管界面待添加
//       }
//     }
//   }else{//如果未登录
//       //想进入需要登录的界面，则定向回到登录界面
//       if(to.meta.isLogin){
//         next({ path: '/login' });
//         ElementUI.Message({//消息提示请先登录
//           showClose: true,
//           message: "请先登录！",
//           duration: 5000,
//           type: 'error'
//         });
//       }else{
//         //用户进入无需登录的界面，跳转继续
//         next()
//       }
//     }
// });

// router.afterEach(route => {
//   window.scroll(0,0);//滚动条到最顶部
// })



