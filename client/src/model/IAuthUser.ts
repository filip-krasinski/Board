export interface IAuthUser {
    id: number,
    authProvider: string,
    avatarUrl: string,
    email: string,
    name: string,
    posts: IAuthUserPost[]
}

export interface IAuthUserPost {
    id: number,
    title: string,
    uploadTime: Date,
    imagePath: string
}