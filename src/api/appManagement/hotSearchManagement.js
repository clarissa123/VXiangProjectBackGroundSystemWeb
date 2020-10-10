import {
    get,
    post,
    deletePost,
    addPost
} from '../index'

//热词管理-获取列表
export const getHotWordList = p => get('/tNoviceHotWord/page', p);

//热词管理-添加
export const addHotWord = p => addPost('/tNoviceHotWord/add', p);

//热词管理-删除
export const deleteHotWord = p => deletePost('/tNoviceHotWord/delete', p);

//热词管理-修改
export const updateHotWord = p => addPost('/tNoviceHotWord/update', p);
