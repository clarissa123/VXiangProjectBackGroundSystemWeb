import { get,post } from '@/api/index'

export const add = p => post('/config/vip/add', p)
export const del = p => post('/config/vip/del', p)
export const edit = p => post('/config/vip/edit', p)
export const getDetail = p => get('/config/vip/get', p)
export const list = p => get('/config/vip/list', p)
export const used = p => post('/config/vip/used', p)
export const changeStatus = p => post('/config/vip/used', p)

