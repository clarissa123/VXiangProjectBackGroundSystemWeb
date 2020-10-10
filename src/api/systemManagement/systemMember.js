import {
    get,
    addPost,
    post
} from '../index'

//会员设置-列表
export const getMemList = p => get('/config/rewardsAndMember/get', p);

//会员设置-修改
export const updateMem = p => addPost('/config/rewardsAndMember/edit', p);
