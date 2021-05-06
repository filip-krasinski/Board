import React, { createContext, useEffect, useReducer } from 'react';
import {Reducer, State, Action} from './Reducer'
import Agent from '../api/Agent';

interface ContextTypes {
    state: State,
    dispatch: React.Dispatch<Action>
}

const initialState: State = {
    currentUser: null,
    loading: false,
};

const Store = (props: any) => {
    const [state, dispatch] = useReducer(Reducer, initialState);

    useEffect(() => {
        let isMounted = true;
        const load = async() => {
            if (isMounted) dispatch({type: 'SET_LOADING', payload: true});

            try {
                const iAuthUser = await Agent.User.current()
                if (isMounted) dispatch({type: 'SET_CURRENT_USER', payload: iAuthUser});
            } catch (error) {
                console.log(error)
            }

            if (isMounted) dispatch({type: 'SET_LOADING', payload: false});
        }
        const setTheme = () => {
            const theme = localStorage.getItem('theme');
            if (theme) document.documentElement.setAttribute('data-theme', theme);
        }
        setTheme()
        load()
        return () => { isMounted = false }
    }, [dispatch])

    return (
        <Context.Provider value={{state, dispatch}}>
            {!state.loading ? props.children : null}
        </Context.Provider>
    )
};

// @ts-ignore
export const Context = createContext<ContextTypes>(null);
export default Store;