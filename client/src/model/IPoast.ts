import { IAuthUser } from './IAuthUser';

export interface IPost {
    id: number,
    title: string,
    uploadTime: Date,
    imagePath: string,
    author: IAuthUser
}