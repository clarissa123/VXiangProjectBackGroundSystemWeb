import { get,post } from '@/api/index'

export const htUserList = p => get('/sys/admin/list', p)
export const addUser = p => post('/sys/admin/add', p)
export const getUser = p => get('/sys/admin/get', p)
export const editUser = p => post('/sys/admin/edit', p)
export const delUser = p => post('/sys/admin/del', p)
