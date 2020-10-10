const bannerManagement = () => import('@/view/appManagement/bannerManagement.vue')
const xieyi = () => import('@/view/appManagement/xieyi.vue')
const drbManagement = () => import('@/view/appManagement/drbManagement.vue')
const addDrbManagement = () => import('@/view/appManagement/addDrbManagement.vue')
const editDrbManagement = () => import('@/view/appManagement/editDrbManagement.vue')
const lookDrbManagement = () => import('@/view/appManagement/lookDrbManagement.vue')
const tgDataManagement = () => import('@/view/appManagement/tgDataManagement.vue')
const kfManagement = () => import('@/view/appManagement/kfManagement.vue')
const addKfManagement = () => import('@/view/appManagement/addKfManagement.vue')
const editKfManagement = () => import('@/view/appManagement/editKfManagement.vue')
const tgManagement = () => import('@/view/appManagement/tgManagement.vue')
const addTgManagement = () => import('@/view/appManagement/addTgManagement.vue')
const editTgManagement = () => import('@/view/appManagement/editTgManagement.vue')
const hotSearchManagement = () => import('@/view/appManagement/hotSearchManagement.vue')

const courseManagementList = () => import('@/view/appManagement/courseManagement/courseManagementList.vue')
const addCourseManagement = () => import('@/view/appManagement/courseManagement/addCourseManagement.vue')
const lookCourseManagement = () => import('@/view/appManagement/courseManagement/lookCourseManagement.vue')
const editCourseManagement = () => import('@/view/appManagement/courseManagement/editCourseManagement.vue')
const courseManagementType = () => import('@/view/appManagement/courseManagement/courseManagementType.vue')

const scriptManagementList = () => import('@/view/appManagement/scriptManagement/scriptManagementList.vue')
const addScriptManagement = () => import('@/view/appManagement/scriptManagement/addScriptManagement.vue')
const lookScriptManagement = () => import('@/view/appManagement/scriptManagement/lookScriptManagement.vue')
const editScriptManagement = () => import('@/view/appManagement/scriptManagement/editScriptManagement.vue')
const scriptManagementType = () => import('@/view/appManagement/scriptManagement/scriptManagementType.vue')
export default [{
        path: "/bannerManagement",
        name: "bannerManagement",
        component: bannerManagement,
        meta: {
            title: 'banner管理',
            keepAlive: true
        }
    },
    {
        path: "/courseManagementList",
        name: "courseManagementList",
        component: courseManagementList,
        meta: {
            title: '教程列表',
            keepAlive: true
        }
    },
    {
        path: "/addCourseManagement",
        name: "addCourseManagement",
        component: addCourseManagement,
        meta: {
            title: '新增教程',
            keepAlive: true
        }
    },
    {
        path: `/lookCourseManagement/:id`,
        name: "lookCourseManagement",
        component: lookCourseManagement,
        meta: {
            title: '查看教程',
            keepAlive: true
        }
    },
    {
        path: `/editCourseManagement/:id`,
        name: "editCourseManagement",
        component: editCourseManagement,
        meta: {
            title: '编辑',
            keepAlive: true
        }
    },
    {
        path: "/courseManagementType",
        name: "courseManagementType",
        component: courseManagementType,
        meta: {
            title: '分类管理',
            keepAlive: true
        }
    },

    {
        path: "/scriptManagementList",
        name: "scriptManagementList",
        component: scriptManagementList,
        meta: {
            title: '教程列表',
            keepAlive: true
        }
    },
    {
        path: "/addScriptManagement",
        name: "addScriptManagement",
        component: addScriptManagement,
        meta: {
            title: '新增教程',
            keepAlive: true
        }
    },
    {
        path: `/lookScriptManagement/:id`,
        name: "lookScriptManagement",
        component: lookScriptManagement,
        meta: {
            title: '查看教程',
            keepAlive: true
        }
    },
    {
        path: `/editScriptManagement/:id`,
        name: "editScriptManagement",
        component: editScriptManagement,
        meta: {
            title: '编辑',
            keepAlive: true
        }
    },
    {
        path: "/scriptManagementType",
        name: "scriptManagementType",
        component: scriptManagementType,
        meta: {
            title: '分类管理',
            keepAlive: true
        }
    },

    {
        path: "/drbManagement",
        name: "drbManagement",
        component: drbManagement,
        meta: {
            title: '达人榜管理',
            keepAlive: true
        }
    }, {
        path: "/addDrbManagement",
        name: "addDrbManagement",
        component: addDrbManagement,
        meta: {
            title: '创建达人',
            keepAlive: true
        }
    }, {
        path: `/editDrbManagement/:id`,
        name: "editDrbManagement",
        component: editDrbManagement,
        meta: {
            title: '编辑达人',
            keepAlive: true
        }
    }, {
        path: `/lookDrbManagement/:id`,
        name: "lookDrbManagement",
        component: lookDrbManagement,
        meta: {
            title: '查看达人',
            keepAlive: true
        }
    }, {
        path: "/tgDataManagement",
        name: "tgDataManagement",
        component: tgDataManagement,
        meta: {
            title: '推广数据',
            keepAlive: true
        }
    },
    {
        path: "/kfManagement",
        name: "kfManagement",
        component: kfManagement,
        meta: {
            title: '客服管理',
            keepAlive: true
        }
    },
    {
        path: "/xieyi",
        name: "xieyi",
        component: xieyi,
        meta: {
            title: '协议&制度',
            keepAlive: true
        }
    },
    {
        path: "/addKfManagement",
        name: "addKfManagement",
        component: addKfManagement,
        meta: {
            title: '添加客服',
            keepAlive: true
        }
    },
    {
        path: `/editKfManagement/:id`,
        name: "editKfManagement",
        component: editKfManagement,
        meta: {
            title: '编辑客服',
            keepAlive: true
        }
    },
    {
        path: "/tgManagement",
        name: "tgManagement",
        component: tgManagement,
        meta: {
            title: '推广管理',
            keepAlive: true
        }
    },
    {
        path: "/addTgManagement",
        name: "addTgManagement",
        component: addTgManagement,
        meta: {
            title: '新增推广文字',
            keepAlive: true
        }
    },
    {
        path: `/editTgManagement/:id`,
        name: "editTgManagement",
        component: editTgManagement,
        meta: {
            title: '编辑推广文字',
            keepAlive: true
        }
    },
    {
        path: "/hotSearchManagement",
        name: "hotSearchManagement",
        component: hotSearchManagement,
        meta: {
            title: '热搜管理',
            keepAlive: true
        }
    },

]