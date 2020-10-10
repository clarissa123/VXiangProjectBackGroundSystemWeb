import {
    get,
    addPost
} from '../index'

//提现记录-获取统计数据
export const getTotal = p => get('/finance/accountOut/count', p);

//提现记录-获取列表
export const getList = p => get('/finance/accountOut/list', p);

//提现记录-通过记录
export const allow = p => addPost('/finance/accountOut/allow', p);

//提现记录-不通过记录
export const notAllow = p => addPost('/finance/accountOut/notAllow', p);

//获取手续费配置
export const getAccountOut = p => get('/config/accountOut/get', p);

//修改手续费配置
export const editAccountOut = p => addPost('/config/accountOut/edit', p);