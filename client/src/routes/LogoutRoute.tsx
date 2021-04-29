import React, { useContext, useEffect } from 'react';
import { Redirect, Route } from 'react-router-dom';
import { Context } from '../app/Store';

export const LogoutRoute = ({ ...rest }) => {
    const { dispatch } = useContext(Context);

    useEffect(() => {
        localStorage.removeItem('accessToken')
        dispatch({type: 'SET_CURRENT_USER', payload: null})
    }, [])

    return (
        <Route {...rest} render={props =>
            <Redirect to={{
                pathname: '/',
                state: {from: props.location}
            }}/>
            }
        />
    )
};