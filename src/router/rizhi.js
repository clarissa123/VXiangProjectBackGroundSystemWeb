const rizhiList = () => import('@/view/rizhiManagement/rizhiList.vue')
export default [{
    path: "/rizhiList",
    name: "rizhiList",
    component: rizhiList,
    meta: {
        title: '日志管理',
        keepAlive: true
    },
}]