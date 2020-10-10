const systemDistribution = () => import('@/view/systemManagement/systemDistribution.vue')
const systemVip = () => import('@/view/systemManagement/systemVip.vue')
const systemUserHt = () => import('@/view/systemManagement/systemUser/systemUserHt.vue')
const addSystemUserHt = () => import('@/view/systemManagement/systemUser/addSystemUserHt.vue')
const systemUserApp = () => import('@/view/systemManagement/systemUser/systemUserApp.vue')
const systemMember = () => import('@/view/systemManagement/systemMember.vue')
export default [

    {
        path: "/systemDistribution",
        name: "systemDistribution",
        component: systemDistribution,
        meta: {
            title: "分销管理",
            keepAlive: true
        }

    },
    {
        path: "/systemUserHt",
        name: "systemUserHt",
        component: systemUserHt,
        meta: {
            title: "后台用户",
            keepAlive: true
        }
    },
    {
        path: "/addSystemUserHt",
        name: "addSystemUserHt",
        component: addSystemUserHt,
        meta: {
            title: "添加后台用户",
            keepAlive: true
        }
    },
    {
        path: "/systemUserApp",
        name: "systemUserApp",
        component: systemUserApp,
        meta: {
            title: "app用户",
            keepAlive: true
        }
    },
    {
        path: "/systemVip",
        name: "systemVip",
        component: systemVip,
        meta: {
            title: "vip管理",
            keepAlive: true
        }
    },
    {
        path: "/systemMember",
        name: "systemMember",
        component: systemMember,
        meta: {
            title: "会员管理",
            keepAlive: true
        }
    },
]