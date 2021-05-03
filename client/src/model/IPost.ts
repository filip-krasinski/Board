import { IAuthUser } from './IUser';
import { IComment } from './IComment';

export interface IPost {
    id: number,
    title: string,
    uploadTime: Date,
    imagePath: string,
    author: IAuthUser,
    comments: IComment[]
    pinnedBy: IAuthUser[]
}