import {
    get,
    addPost
} from '../index'

//京东平台-查询所有频道信息
export const getAll = p => get('/jd/sku/elite/all', p);

//京东平台-获取商品信息
export const getMaterialList = p => get('/jd/sku/jinfen', p);

//京东平台-商品入库
export const addInfo = p => addPost('/jd/sku/add/info', p);