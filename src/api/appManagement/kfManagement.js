import {
    get,
    post,
    deletePost,
    addPost
} from '../index'

//客服管理-获取列表
export const getCustomerList = p => get('/customerService/list', p);

//客服管理-添加
export const addCustomer = p => addPost('/customerService/add', p);

//客服管理-删除
export const deleteCustomer = p => deletePost('/customerService/delete', p);

//客服管理-修改
export const updateCustomer = p => addPost('/customerService/update', p);
