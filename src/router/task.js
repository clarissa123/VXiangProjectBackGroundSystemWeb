const taskExamine = () => import('@/view/taskManagement/taskExamine.vue')
const taskList = () => import('@/view/taskManagement/taskList.vue')
const addTask = () => import('@/view/taskManagement/addTask.vue')
const editTask = () => import('@/view/taskManagement/editTask.vue')
const copyTask = () => import('@/view/taskManagement/copyTask.vue')
const copyTask2 = () => import('@/view/taskManagement/copyTask2.vue')
const copyTaskTb = () => import('@/view/taskManagement/copyTaskTb.vue')
const taskDetail = () => import('@/view/taskManagement/taskDetail.vue')
const typeList = () => import('@/view/taskManagement/typeList.vue')
export default [{
        path: "/taskExamine",
        name: "taskExamine",
        component: taskExamine,
        meta: {
            title: "任务审核",
            keepAlive: true,
        }
    },
    {
        path: "/taskList",
        name: "taskList",
        component: taskList,
        meta: {
            title: "任务面板",
            keepAlive: true,
        },
    },
    {
        path: "/addTask",
        name: "addTask",
        component: addTask,
        meta: {
            title: "新增任务",
            keepAlive: true,
        },
    },
    {
        path: `/taskDetail/:id`,
        name: "taskDetail",
        component: taskDetail,
        meta: {
            title: "任务详情",
            keepAlive: true,
        },
    },
    {
        path: `/editTask/:id`,
        name: "editTask",
        component: editTask,
        meta: {
            title: "编辑任务",
            keepAlive: true,
        },
    },
    // 京东平台的创建任务
    {
        path: `/copyTask/:id`,
        name: "copyTask",
        component: copyTask,
        meta: {
            title: "快速复制任务",
            keepAlive: true,
        },
    },
    // 任务列表的快速复制
    {
        path: `/copyTask2/:id`,
        name: "copyTask2",
        component: copyTask2,
        meta: {
            title: "快速复制任务",
            keepAlive: true,
        },
    },
    // 淘宝平台的创建任务
    {
        path: `/copyTaskTb/:id`,
        name: "copyTaskTb",
        component: copyTaskTb,
        meta: {
            title: "快速复制任务",
            keepAlive: true,
        },
    },
    {
        path: "/typeList",
        name: "typeList",
        component: typeList,
        meta: {
            title: "分类设置",
            keepAlive: true,
        },
    },

]