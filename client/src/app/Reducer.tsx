import { IAuthUser } from '../model/IUser';

export interface State {
    currentUser: IAuthUser | null,
    loading: boolean,
}

export interface Action {
    type: string,
    payload: any
}

export const Reducer = (state: State, action: Action): State => {
    switch (action.type) {
        case 'SET_CURRENT_USER':
            return {
                ...state,
                currentUser: action.payload
            };
        case 'SET_LOADING':
            return {
                ...state,
                loading: action.payload
            };
        default:
            return state;
    }
};