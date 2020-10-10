const taobaoList = () => import('@/view/commodityManagement/taobaoList.vue')
const jdList = () => import('@/view/commodityManagement/jdList.vue')
export default [{
    path: "/taobaoList",
    name: "taobaoList",
    component: taobaoList,
    meta: {
        title: '淘宝平台',
        keepAlive: true
    },
}, {
    path: "/jdList",
    name: "jdList",
    component: jdList,
    meta: {
        title: '京东平台',
        keepAlive: true
    },
}]