import { IAuthUser } from './IUser';
import { IComment } from './IComment';

export interface IPost {
    id: number,
    title: string,
    uploadTime: Date,
    imagePath: string,
    imageHeight: number,
    imageWidth: number,
    author: IAuthUser,
    comments: IComment[]
    pinnedBy: IAuthUser[]
}