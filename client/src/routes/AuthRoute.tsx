import React, { useContext, useEffect } from 'react';
import { Redirect, Route} from 'react-router-dom';
import Store, { Context } from '../app/Store';

// @ts-ignore
export const AuthRoute = ({ component: Component, ...rest }) => {
    const {state, dispatch} = useContext(Context);

    return (
        <Route
            {...rest}
            render={props =>
                state.currentUser ? (
                    <Store>
                        <Component {...rest} {...props} />
                    </Store>
                ) : (
                    <Store>
                        <Redirect to={{
                            pathname: '/',
                            state: {from: props.location}
                        }}/>
                    </Store>

            )}
        />
    )
};