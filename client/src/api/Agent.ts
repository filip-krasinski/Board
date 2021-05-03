import axios, { AxiosResponse } from 'axios';
import { IAuthUser } from '../model/IUser';
import { IPost } from '../model/IPost';
import { IComment } from '../model/IComment';

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
    get: (url: string) => axios.get(url).then(responseBody),
    post: (url: string, params: any) => axios.post(url, null, {params: params}).then(responseBody),
    getParams: (url: string, params: any) => axios.get(url, {params: params}).then(responseBody),
    postForm: (url: string, data: FormData) => axios.post(url, data).then(responseBody),

}

const User = {
    current: (): Promise<IAuthUser> => requests.get('/user/me'),
    get: (id: string): Promise<IAuthUser> => requests.getParams('/user', {id: id}),
    pin: (postId: number) => requests.post('/user/pin', {postId: postId}),
    unpin: (postId: number) => requests.post('/user/unpin', {postId: postId}),
}

const Post = {
    upload: (data: FormData): Promise<IPost> => requests.postForm('/post/add', data),
    get: (id: string): Promise<IPost> => requests.getParams('/post', {id: id}),
    getList: (page: number, size: number): Promise<IPost[]> =>
        axios.get('/post/get', {params: {pageNumber: page, pageSize: size}}).then(res => res.data.content),
    addComment: (postId: number, content: string): Promise<IComment> =>
        requests.post('/post/comments/add', {postId: postId, content: content})
}


export default {
    User,
    Post
};