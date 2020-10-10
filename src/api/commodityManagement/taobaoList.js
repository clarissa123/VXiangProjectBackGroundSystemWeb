import {
    get,
    post,
    deletePost,
    addPost
} from '../index'

//淘宝平台-普通搜索
export const getNormalList = p => get('/taobao/search', p);

//淘宝平台-物料搜索
export const getMaterialList = p => get('/taobao/material', p);