import React, { useContext} from 'react';
import { Redirect, Route} from 'react-router-dom';
import Store, { Context } from '../app/Store';

// @ts-ignore
export const AuthRoute = ({ component: Component, ...rest }) => {
    const {state} = useContext(Context);

    return (
        <Store>
        <Route
            {...rest}
            render={props =>
                state.currentUser ? (
                    <Component {...rest} {...props} />
                ) : (
                    <Redirect to={{
                        pathname: '/',
                        state: {from: props.location}
                    }}/>
            )}
        />
        </Store>
    )
};