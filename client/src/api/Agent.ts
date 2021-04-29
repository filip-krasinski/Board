import axios, { AxiosResponse } from 'axios';
import { IAuthUser } from '../model/IAuthUser';
import { IPost } from '../model/IPoast';

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

axios.interceptors.response.use(undefined, error => {
    const {status} = error.response;
    if (status === 401) {
        console.log(401)
    }
    throw error.response
});

const responseBody = (response: AxiosResponse) => response.data;
const requests = {
    get: (url: string) => axios.get(url).then(responseBody),
    postForm: (url: string, data: FormData) => axios.post(url, data).then(responseBody),

}

const User = {
    current: (): Promise<IAuthUser> => requests.get('/user/me'),
}

const Post = {
    upload: (data: FormData) => requests.postForm('/post/add', data),
    getList: (page: number, size: number): Promise<IPost[]> =>
        axios.get('/post/get', {params: {pageNumber: page, pageSize: size}}).then(res => res.data.content)
}


export default {
    User,
    Post
};