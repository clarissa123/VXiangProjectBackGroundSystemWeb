import {
    get,
    post,
    deletePost,
    addPost
} from '../../index'

//教程列表-添加
export const addTutorial = p => addPost('/noviceTutorial/add', p);

//教程列表-删除
export const deleteTutorial = p => deletePost('/noviceTutorial/delete', p);

//教程列表-列表
export const getTutorialList = p => get('/noviceTutorial/page', p);

//教程列表-修改
export const updateTutorial = p => addPost('/noviceTutorial/update', p);

//教程列表-查看
export const lookTutorial = p => get('/noviceTutorial/detail', p);