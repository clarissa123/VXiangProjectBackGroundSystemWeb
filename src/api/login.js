import {
    addPost,
} from './index'

export const joinLogin = p => addPost('/sys/admin/login', p);