import Vue from 'vue'
import VueRouter from 'vue-router'
import Index from '../view/index.vue'
import commodity from '../router/commodity'
import finance from '../router/finance'
import system from '../router/system'
import task from '../router/task'
import app from '../router/app'
import rizhi from '../router/rizhi'
import Login from '../view/login'
import {
  Message
} from 'element-ui';

Vue.use(VueRouter)

const routes = [{
    path: "/",
    name: 'login',
    component: Login,
    meta: {
      title: "欢迎登录",
      keepAlive: false
    },
  }, {
    path: "/login",
    name: 'login',
    component: Login,
    meta: {
      title: "欢迎登录",
      keepAlive: false
    },
  },
  {
    path: "/index",
    component: Index,
    redirect: "/taskList",
    children: [
      ...commodity,
      ...finance,
      ...system,
      ...task,
      ...app,
      ...rizhi
    ]
  },
]

const router = new VueRouter({
  //路由模式
  linkActiveClass: 'active',
  mode: "hash",
  routes,
})

// 全局路由守卫 拦截所有路由
router.beforeEach((to, from, next) => {
  // 根据路由元信息设置文档标题
  window.document.title = to.meta.title || 'V享'
  next();
  // 获取token
  const access = window.localStorage.getItem('access_token');
  // 有token
  if (access) {
    // 直接放行
    next();
  } else { // 否则是没有
    // 如果去的是登录页
    if (to.path === '/login') {
      // 直接放行
      next();
    } else {
      // 如果去的是其他页,跳转到登录页
      Message.error('请登录以后再操作！')
      // 跳转到登录页
      return next({
        "path": "/login"
      })
    }
  }
})

export default router