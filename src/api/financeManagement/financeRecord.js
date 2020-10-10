import {
    get,
} from '../index'

//流水记录-获取统计数据
export const getTotal = p => get('/finance/statement/count', p);

//流水记录-获取列表
export const getList = p => get('/finance/statement/list', p);

//流水记录-获取类型下拉列表
export const getServiceType = p => get('/finance/statement/listServiceType', p);