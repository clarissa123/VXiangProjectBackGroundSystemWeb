# 前言
* 一个基于Vue前端框架和element的UI框架搭建的后台管理系统。通过vue-cli脚手架构建项目、组件封装、组件之间的通信，使内部数据可实现自由替换和组合。
* 如果感觉还不错的话，老铁们是不是赏个★Star鼓励一哈，后续会持续更新和优化，也期待大家的交流。
* 欢迎加微信多沟通交流,坐标成都,本菇娘的微信:qingqingtu0791。

# 安装
```
yarn install
```

# 运行
```
yarn serve
```

### 打包
```
yarn build
```

# 作者
前端程序员，性别女，坐标成都，籍贯江西九江市，本科。

# 项目架构
```
│  vue.config.js                     // webpack配置              
├─public
│      favicon.ico                   // ico图标
│      index.html                    // 入口html文件
└─src
    │  App.vue                       // 根组件
    │  main.js                       // 程序入口文件
    ├─assets
    │  ├─images                       // 存放公共图片文件夹      
    │  └─style
    │      │  mixin.less              // 基础样式文件
    │      │  common.less             // 重置样式文件
    │      └─ myUI.less               // 公共样式文件
    ├─common
    │  ├─font.css                       // 字体文件   
    │  └─ionicons.143146fa.woff2        //自定义字体文件
    │  └─PingFang Medium.woff2          //自定义字体文件
    ├─components
    │      header                       // 头部
    │      Pagination                   // 分页
    │      popup                        // 弹框
    │      top                          // 带插槽的主体的表格头部
    │      upload                       // 图片上传
    │      wangEditor                   // 富文本编辑器
    ├─router
    │      index.js                       // 单页面路由注册组件
    │      commodity.js                   // 单页面路由注册组件
    │      finance.js                     // 单页面路由注册组件
    │      app.js                         // 单页面路由注册组件
    │      login.js                       // 单页面路由注册组件
    │      rizhi.js                       // 单页面路由注册组件
    │      system.js                      // 单页面路由注册组件
    │      task.js                        // 单页面路由注册组件
    ├─store
    │      index.js                   // 状态管理仓库未使用到
    └─views
            Brand.vue                 // 公司品牌介绍
            Home.vue                  // 酷屏首页统计图
            Login.vue                 // 登录界面
```


### Customize configuration
See [Configuration Reference](https://cli.vuejs.org/config/).
