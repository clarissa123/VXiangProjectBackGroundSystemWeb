import { get,post,} from '@/api/index'

export const appList = p => get('/userInfo/list', p)
export const buyVip = p => post('/userInfo/buyVip', p)
export const listBuyVip = p => get('/userInfo/listBuyVip', p)
export const listVip = p => get('/userInfo/listVip', p) 
export const remark = p => post('/userInfo/remark', p)
export const ChangeUser = p => get('/userInfo/frozen', p)
export const UserUse = p => get('/userInfo/release', p)
export const lockVip = p => post('/userInfo/undo', p)
