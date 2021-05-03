import { IAuthUser } from './IUser';

export interface IComment {
    id: number
    content: string,
    author: IAuthUser,
    creationTime: Date,
}