import React from 'react';
import { Route, Router, Switch } from 'react-router-dom';
import { OAuth2RedirectHandler } from '../api/Oauth2RedirectHandler';
import { AuthRoute } from '../routes/AuthRoute';
import { history } from './history';
import { PostsGrid } from '../components/PostsGrid';
import { LogoutRoute } from '../routes/LogoutRoute';
import { NotFound } from '../components/NotFound';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Profile } from '../components/Profile';
import { PostUpload } from '../components/PostUpload';
import { Sidebar } from '../components/sidebar/Sidebar';
import { PostCard } from '../components/post_card/PostCard';

const App = () => {
    return (
        <>
            <ToastContainer/>
            <div className='root'>
                <div>
                    <Router history={history}>
                        <Sidebar />
                        <div className='main'>
                            <Switch>
                                <Route exact path='/' component={PostsGrid} />
                                <Route exact path='/post/:id' component={PostCard} />
                                <Route exact path='/profile/:id' component={Profile} />
                                <Route exact path='/oauth2/redirect' component={OAuth2RedirectHandler} />
                                <LogoutRoute exact path='/logout' />
                                <AuthRoute   exact path='/add_post' component={PostUpload} />
                                <Route component={NotFound} />
                            </Switch>
                        </div>
                    </Router>
                </div>
            </div>
        </>
    )
}

export default App;