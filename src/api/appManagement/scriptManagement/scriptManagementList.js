import {
    get,
    post,
    deletePost,
    addPost
} from '../../index'

//教程列表-添加
export const addTutorial = p => addPost('/videoScript/add', p);

//教程列表-删除
export const deleteTutorial = p => deletePost('/videoScript/delete', p);

//教程列表-列表
export const getTutorialList = p => get('/videoScript/page', p);

//教程列表-修改
export const updateTutorial = p => addPost('/videoScript/update', p);

//教程列表-查看
export const lookTutorial = p => get('/videoScript/detail', p);