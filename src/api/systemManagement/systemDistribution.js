import {
    get,
    addPost,
    post
} from '../index'

//消息管理-获取列表
export const getDisList = p => get('/pushMessage/list', p);

//消息管理-修改
export const updateDis = p => addPost('/pushMessage/update', p);

//banner管理-批量删除
export const deleteDis = p => addPost('/pushMessage/delete', p);

//任务管理-添加
export const addDis = p => addPost('/pushMessage/add', p);

// // 日志导出
// export const exportLoge = p => get('/sys/admin/log/export', p);
export const getDisList2 = p => get('/sys/admin/oper/log', p);