import {
    get,
    post,
    deletePost,
    addPost
} from '../index'

//banner管理-获取列表
export const getbannerList = p => get('/banner/page', p);

//banner管理-添加
export const addBanner = p => addPost('/banner/add', p);

//banner管理-删除
export const deleteBanner = p => deletePost('/banner/delete', p);

//banner管理-修改
export const updateBanner = p => addPost('/banner/update', p);

//获取教程分类的主标题
export const getMainTitle = p => get('/noviceTutorial/list', p);