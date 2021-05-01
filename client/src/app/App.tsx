import React, { useContext, useEffect } from 'react';
import Store, { Context } from './Store';
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
import { Post } from '../components/Post';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Profile } from '../components/Profile';

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
        <>
            <ToastContainer

            />
            <div className='root'>
                {!state.loading ? (
                    <div>
                        <Router history={history}>
                            <Sidebar />
                            <div className='main'>
                                <Switch>
                                    <Route exact path='/' component={PostsList} />
                                    <Route exact path='/post/:id' component={Post} />
                                    <Route exact path='/profile/:id' component={Profile} />
                                    <Route exact path='/oauth2/redirect' component={OAuth2RedirectHandler} />
                                    <LogoutRoute exact path='/logout' />
                                    <AuthRoute   exact path='/add_post' component={PostUploadForm} />
                                    <Route component={NotFound} />
                                </Switch>
                            </div>
                        </Router>
                    </div>
                ) : (
                    'Loading'
                )}
            </div>
        </>
    )
}

export default App;