export interface IAuthUser {
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