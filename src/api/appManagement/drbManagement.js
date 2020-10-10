import {
    get,
    post,
    deletePost,
    addPost
} from '../index'

//达人榜管理-获取列表
export const getMasterList = p => get('/masterRanking/page', p);

//达人榜管理-添加
export const addMaster = p => addPost('/masterRanking/add', p);

//达人榜管理-删除
export const deleteMaster = p => deletePost('/masterRanking/delete', p);

//达人榜管理-修改
export const updateMaster = p => addPost('/masterRanking/update', p);

//达人榜管理-设置属性
export const updateSetting = p => get('/masterRanking/updateSetting', p);

//达人榜管理-查看属性
export const lookSetting = p => get('/masterRanking/setting', p);
