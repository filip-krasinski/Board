import React, { createRef, useContext, useState } from 'react';
import { Context } from '../app/Store';
import {ImGithub, ImHome} from 'react-icons/im'
import {CgProfile} from 'react-icons/cg'
import {IoMdAddCircle} from 'react-icons/io'
import {FiSettings} from 'react-icons/fi'
import { SidebarOption } from './SidebarOption';
import { SignInButton } from './SignInButton';
import { GiHamburgerMenu } from 'react-icons/gi'
import { ImCross } from 'react-icons/im'


const API_URL = process.env.REACT_APP_API_URL;
const APP_URL = process.env.REACT_APP_APP_URL;

export const Sidebar: React.FC = () => {
    const {state, dispatch} = useContext(Context);
    const [isOpened, setOpened] = useState<boolean>(false)
    const domRef = createRef<HTMLDivElement>();
    const burgerRef = createRef<HTMLDivElement>();

    return (
        <>

            <div
                ref={burgerRef}
                className='hamburger'
                onClick={() => {
                    if (domRef.current == null || burgerRef.current == null)
                        return
                    if (isOpened) {
                        domRef.current.classList.remove('show')
                        burgerRef.current.classList.remove('close');
                        setOpened(false)
                    } else {
                        domRef.current.classList.add('show');
                        burgerRef.current.classList.add('close');
                        setOpened(true)
                    }
                }}
            >
                {
                    isOpened ? (<ImCross />) : (<GiHamburgerMenu />)
                }
            </div>

            <div ref={domRef} className='sidebar'>
                <div className='sidebar_fixed'>
                    <div className='sidebar-column'>
                        <div className='sidebar_logo'>
                            Board
                        </div>

                        {state.currentUser ? (
                            <>
                                <div className='sidebar-user_avatar'>
                                    <img alt="" src={state.currentUser.avatarUrl} />
                                </div>

                                <div className='sidebar-user_email'>{state.currentUser.email}</div>
                            </>
                        ) : null}

                        <span className='sidebar_hline' />


                        <SidebarOption icon={<ImHome        />}  text='Home'    href='/'          />
                        <SidebarOption icon={<IoMdAddCircle />}  text='Upload'  href='/add_post'  />


                        {state.currentUser ? (
                            <>
                                <SidebarOption icon={<CgProfile  />}  text='Profile'  href={`/profile/${state.currentUser.id}`}     />
                                <SidebarOption icon={<FiSettings />}  text='Settings' href='/TODO' />
                                <SidebarOption icon={<FiSettings />}  text='Logout'   href='/logout'   />
                            </>
                        ) : (
                            <>
                                <SignInButton
                                    icon={<ImGithub />}
                                    text='Sign in with Github'
                                    href={API_URL + '/oauth2/authorize/github?redirect_uri=' + APP_URL + '/oauth2/redirect'}
                                />
                            </>
                        )}

                    </div>
                </div>
            </div>
        </>
    )
}