import {
    get,
    addPost,
    deleteW,
    deletePost,
    put,
    put2,
    put3
} from '../index'

//任务管理-获取列表
export const getTaskList = p => get('/assignment/query/back/multi', p);

//任务管理-添加
export const addTask = p => addPost('/assignment/create', p);

//任务管理-删除
export const deleteTask = p => deleteW('/assignment/delete?aid=' + p);

//任务管理-修改
export const updateTask = p => put('/assignment/update', p);

//任务管理-查看
export const lookTask = p => get('/assignment/query/one/' + p);

//任务管理-搜索下拉框
export const getType = p => get('/assignment/query/type/all', p);

//任务管理-改变状态
export const changeStatus = p => put2('/assignment/publish?aid=' + p);

//获取任务分类
export const getQueryPage = p => get('/assignment/cat/queryPage', p);

//新增任务分类
export const addType = p => deletePost('/assignment/cat/add', p);

//修改任务分类
export const updateType = p => put3('/assignment/cat/update', p);

//删除任务分类
export const deleteType = p => deleteW('/assignment/cat/delete?id=' + p);

//获取一级分类名称
export const getFirstType = p => get('/assignment/query/type/all', p);
