import React, {createContext, useReducer} from "react";
import {Reducer, State, Action} from './Reducer'

interface ContextTypes {
    state: State,
    dispatch: React.Dispatch<Action>
}

const initialState: State = {
    currentUser: null,
    loading: false
};

const Store = (props: any) => {
    const [state, dispatch] = useReducer(Reducer, initialState);

    return (
        <Context.Provider value={{state, dispatch}}>
            {props.children}
        </Context.Provider>
    )
};

// @ts-ignore
export const Context = createContext<ContextTypes>(null);
export default Store;