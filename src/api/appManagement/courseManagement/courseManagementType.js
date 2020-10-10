import {
    get,
    post,
    deletePost,
    addPost
} from '../../index'

//教程列表-添加
export const addTutorialType = p => addPost('/noviceTutorialType/insert', p);

//教程列表-删除
export const deleteTutorialType = p => deletePost('/noviceTutorialType/delete', p);

//教程列表-列表
export const getTutorialTypeList = p => get('/noviceTutorialType/page', p);

//教程列表-修改
export const updateTutorialType = p => addPost('/noviceTutorialType/update', p);

