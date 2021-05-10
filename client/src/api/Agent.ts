import axios, { AxiosResponse } from 'axios';
import { IAuthUser } from '../model/IUser';
import { IPost } from '../model/IPost';
import { IComment } from '../model/IComment';
import { IPaged } from '../model/IPaged';

axios.defaults.baseURL = process.env.REACT_APP_API_URL;

axios.interceptors.request.use((config) => {
    const token = localStorage.getItem('accessToken');
    if (token)
        config.headers.Authorization = `Bearer ${token}`

    config.headers.contentType = 'application/json';
    return config;
}, (error) => {
    return Promise.reject(error);
})

const responseBody = (response: AxiosResponse) => response.data;
const requests = {
    get:       (url: string) => axios.get(url).then(responseBody),
    post:      (url: string, params: any) => axios.post(url, null, {params: params}).then(responseBody),
    delete:    (url: string, params: any) => axios.delete(url, {params: params}).then(responseBody),
    getParams: (url: string, params: any) => axios.get(url, {params: params}).then(responseBody),
    postForm:  (url: string, data: FormData) => axios.post(url, data).then(responseBody),

}

const User = {
    current: (): Promise<IAuthUser> => requests.get('/v1/user/me'),
    get: (id: string): Promise<IAuthUser> => requests.getParams('/v1/user/get', {id: id}),
    pin: (postId: number) => requests.post('/v1/user/pin', {postId: postId}),
    unpin: (postId: number) => requests.post('/v1/user/unpin', {postId: postId}),
}

const Post = {
    add: (data: FormData): Promise<IPost> => requests.postForm('/v1/post/add', data),
    get: (id: string): Promise<IPost> => requests.getParams('/v1/post/get', {id: id}),
    delete: (id: string) => requests.delete('/v1/post/delete', {id: id}),
    getList: (page: number, size: number): Promise<IPaged<IPost>> =>
        axios.get('/v1/post/list', {params: {pageNumber: page, pageSize: size}}).then(res => res.data),

}

const Comment = {
    delete: (id: string) => requests.delete('/v1/comment/delete', {id: id}),
    add: (postId: number, content: string): Promise<IComment> =>
        requests.post('/v1/comment/add', {postId: postId, content: content})
}

export default {
    User,
    Post,
    Comment
};