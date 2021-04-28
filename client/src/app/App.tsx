import Api from './api/Api';
import { IAuthUser } from './model/IAuthUser';
import { PostsList } from './post/PostsList';
import { Route, Switch} from 'react-router-dom'
import React, { useEffect, useState } from 'react';
import { SidebarMenu } from './sidebar/SidebarMenu';
import { PostUploadForm } from './post/PostUploadForm';
import { OAuth2RedirectHandler } from './OAuth2RedirectHandler';
import { AuthRoute } from './routes/AuthRoute';
import { createBrowserHistory } from 'history';
import { NotFound } from './404/NotFound';

interface RootObject {
    currentUser: IAuthUser | null;
    loading: boolean;
}


export const history = createBrowserHistory();

const App: React.FC = () => {
    const [state, setState] = useState<RootObject>({
        currentUser: null,
        loading: true
    });

    const logout = () => {
        localStorage.removeItem('accessToken');
        setState(prevState => ({...prevState, currentUser: null}));
    }

    const loadCurrentUser = async() => {
        setState(prevState => ({...prevState, loading: true}));

        try {
            const res = await Api.User.current()
            setState(prevState => ({
                ...prevState,
                currentUser: res,
                loading: false
            }));
        } catch (error) {
            console.log(error)
            setState(prevState => ({...prevState, loading: false}));
        }
    }

    useEffect(() => {
        loadCurrentUser()
    }, [])

    console.log(state)
    return (
        <>
            {!state.loading ? (
                <div>
                    <SidebarMenu user={state.currentUser} logout={logout}/>
                    <div className='main'>
                        <Switch>
                            <Route exact path='/' component={PostsList}/>
                            <AuthRoute exact path='/add_post' authenticated={state.currentUser} component={PostUploadForm}/>
                            <Route path='/oauth2/redirect' render={() =>
                                <OAuth2RedirectHandler update={setState}/>
                            }/>
                            <Route component={NotFound} />
                        </Switch>
                    </div>
                </div>
            ) : 'Loading'}
        </>
    )
}

export default App;