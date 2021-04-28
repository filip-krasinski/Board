import React from 'react';
import { Redirect, Route} from 'react-router-dom';

// @ts-ignore
export const AuthRoute = ({ component: Component, authenticated, ...rest }) => {
    return (
        <Route
            {...rest}
            render={props =>
                authenticated ? (
                    <Component {...rest} {...props} />
                ) : (
                    <Redirect to={{
                            pathname: '/',
                            state: {from: props.location}
                        }}
                    />
                )
            }
        />
    )
};