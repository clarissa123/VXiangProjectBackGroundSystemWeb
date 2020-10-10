import {
    get,
    post,
    deletePost,
    addPost,
    deleteW,
    put
} from '../index'

//任务审核-获取列表
export const getAuditList = p => get('/assignment/query/audit/multi', p);

//任务审核-添加
export const addAudit = p => addPost('/assignment/create', p);

//任务审核-删除
export const deleteAudit = p => deleteW('/assignment/delete?aid=' + p);

//任务审核-修改
export const updateAudit = p => addPost('/assignment/update', p);

//任务审核-查看
export const lookAudit = p => get('/assignment/query/one/' + p);

//任务审核-根据id查询详情
export const getAuditById = p => get('/assignment/query/audit/detail', p);

//任务审核-修改弹框详情
export const putAudit = p => put('/assignment/audit', p);

// 新增修改协议
export const xieyiPromise = p => put('/sys/admin/update/agreement', p);

// 查询 协议和制度
export const xieyiZhidui = p => get('/sys/admin/query/agreement', p);