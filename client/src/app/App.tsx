import React, { useContext, useEffect } from 'react';
import { Context } from './Store';
import { Route, Router, Switch } from 'react-router-dom';
import Agent from '../api/Agent';
import { OAuth2RedirectHandler } from '../api/Oauth2RedirectHandler';
import { Sidebar } from '../components/Sidebar';
import { PostUploadForm } from '../components/PostUploadForm';
import { AuthRoute } from '../routes/AuthRoute';
import { history } from './history';
import { PostsList } from '../components/PostList';
import { LogoutRoute } from '../routes/LogoutRoute';
import { NotFound } from '../components/NotFound';

const App = () => {
    const {state, dispatch} = useContext(Context);

    const load = async() => {
        dispatch({type: 'SET_LOADING', payload: true});

        try {
            const iAuthUser = await Agent.User.current()
            dispatch({type: 'SET_CURRENT_USER', payload: iAuthUser});
        } catch (error) {
            console.log(error)
        }

        dispatch({type: 'SET_LOADING', payload: false});
    }

    useEffect(() => {
        load()
    }, [])

    return (
        <div>
            {!state.loading ? (
                <>
                    <Router history={history}>
                        <Sidebar />
                        <div className='main'>
                            <Switch>
                                <Route exact path='/' component={PostsList} />
                                <LogoutRoute exact path='/logout' />
                                <AuthRoute exact path='/add_post' component={PostUploadForm} />
                                <Route exact path='/oauth2/redirect' component={OAuth2RedirectHandler} />
                                <Route component={NotFound} />
                            </Switch>
                        </div>
                    </Router>
                </>
            ) : (
                'Loading'
            )}
        </div>
    )
}

export default App;