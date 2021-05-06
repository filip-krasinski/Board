const mapToTypes = () => {
    // @ts-ignore
    process.env.REACT_APP_MAX_TITLE_LENGTH = parseInt(process.env.REACT_APP_MAX_TITLE_LENGTH as string);
    // @ts-ignore
    process.env.REACT_APP_MAX_COMMENT_SIZE = parseInt(process.env.REACT_APP_MAX_COMMENT_LENGTH as string);
    // @ts-ignore
    process.env.REACT_APP_MAX_DESC_LENGTH = parseInt(process.env.REACT_APP_MAX_DESC_LENGTH as string);
}
mapToTypes()

export interface IProcessEnv {
    REACT_APP_MAX_TITLE_LENGTH: number
    REACT_APP_MAX_COMMENT_LENGTH: number
    REACT_APP_MAX_DESC_LENGTH: number
    REACT_APP_APP_URL: string
    REACT_APP_API_URL: string
}


declare global {
    namespace NodeJS {
        interface ProcessEnv extends IProcessEnv { }
    }
}
