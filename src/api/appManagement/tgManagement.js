import {
    get,
    post,
    deletePost,
    addPost
} from '../index'

//图片推广-添加
export const addPic = p => addPost('/popularizeImage/add', p);

//图片推广-删除
export const deletePic = p => deletePost('/popularizeImage/delete', p);

//图片推广-列表
export const getPicList = p => get('/popularizeImage/page', p);

//图片推广-修改
export const updatePic = p => addPost('/popularizeImage/update', p);




//文字推广-添加
export const addText = p => addPost('/popularizeCopywriting/add', p);

//文字推广-删除
export const deleteText = p => deletePost('/popularizeCopywriting/delete', p);

//文字推广-列表
export const getTextList = p => get('/popularizeCopywriting/page', p);

//文字推广-修改
export const updateText = p => addPost('/popularizeCopywriting/update', p);
