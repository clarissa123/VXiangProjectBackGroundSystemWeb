# 前言
* 一个基于Vue前端框架和element的UI框架搭建的后台管理系统。通过vue-cli脚手架构建项目、组件封装、组件之间的通信，使内部数据可实现自由替换和组合。
* 如果感觉还不错的话，老铁们是不是赏个★Star鼓励一哈，后续会持续更新和优化，也期待大家的交流。
* 欢迎加微信多沟通交流，坐标成都，本菇娘的微信:qingqingtu0791。

# 作者
前端程序员，性别女，坐标成都，籍贯江西九江市，本科。

# 爱好
* 做饭。会做各种家常鱼：糖醋松鼠鱼、红烧鱼、蒸鱼、鲫鱼豆腐汤等；会煲各种汤：山药排骨汤、莲藕排骨汤、海带排骨汤等。欢迎关注我的下厨房账号：手残君爱家的味道。
* 运动。热爱跑步，各种健身运动都来，即使不会的运动也不排斥，愿意学。晚上没事的时候，随便跑跑5公里。欢迎关注我的Keep账号：一直跑下去-姗吖。
* 旅行。曾独自一个人不报旅行团畅玩云南省，去了西双版纳、昆明、大理、丽江。去大理的时候，租了一辆电瓶车，早上8点半出发，第一次骑电瓶车，现学现骑，骑了150公里+，晚上7点还车。
* 更多关注，欢迎加本菇娘微信：qingqingtu0791。

# 安装
```
yarn install
```

# 运行
```
yarn serve
```

# 打包
```
yarn build
```

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
    │      index.js                       // 状态管理仓库未使用到
    └─views
            taskManagement                // 任务管理
            systemManagement              // 系统管理
            rizhiManagement               // 日志管理
            financeManagement             // 结账管理
            commodityManagement           // 商品管理
            appManagement                 // APP管理
```


### Customize configuration
See [Configuration Reference](https://cli.vuejs.org/config/).
