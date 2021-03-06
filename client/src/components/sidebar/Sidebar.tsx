import React, { createRef, useContext, useState } from 'react';
import { Context } from '../../app/Store';
import {ImGithub, ImHome} from 'react-icons/im'
import {CgProfile} from 'react-icons/cg'
import {IoMdAddCircle} from 'react-icons/io'
import {FiSettings} from 'react-icons/fi'
import { SidebarOption } from './SidebarOption';
import { SignInButton } from './SignInButton';
import { GiHamburgerMenu } from 'react-icons/gi'
import { BiLogOut } from 'react-icons/bi'
import { ImCross } from 'react-icons/im'


const API_URL = process.env.REACT_APP_API_URL;
const APP_URL = process.env.REACT_APP_APP_URL;

export const Sidebar: React.FC = () => {
    const {state} = useContext(Context);
    const [isOpened, setOpened] = useState(false)
    const domRef = createRef<HTMLDivElement>();
    const burgerRef = createRef<HTMLDivElement>();

    const onHamburger = () => {
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
    }

    const toggleTheme = () => {
        const doc = document.documentElement;
        const attr = doc.getAttribute('data-theme');
        if (attr === 'light') {
            document.documentElement.setAttribute('data-theme', 'dark');
            localStorage.setItem('theme', 'dark');
        } else {
            document.documentElement.setAttribute('data-theme', 'light');
            localStorage.setItem('theme', 'light');
        }
    }

    return (
        <>
            <div ref={burgerRef} className='hamburger' onClick={onHamburger}>
                { isOpened ? (<ImCross />) : (<GiHamburgerMenu />) }
            </div>

            <div className='sidebar-wrapper'>
            <div ref={domRef} className='sidebar'>
                <div className='flex-column sidebar-column'>
                    <div className='sidebar_logo'>Board</div>

                    {state.currentUser ? (
                        <>
                            <div className='sidebar-user_avatar'>
                                <img alt="" src={state.currentUser.avatarUrl} />
                            </div>

                            <div className='sidebar-user_name'>{state.currentUser.name}</div>
                        </>
                    ) : null}

                    <span className='sidebar_hline' />

                    <SidebarOption icon={<ImHome        />}  text='Home'    href='/'          />
                    <SidebarOption icon={<IoMdAddCircle />}  text='Upload'  href='/add_post'  />

                    {state.currentUser ? (
                        <>
                            <SidebarOption icon={<CgProfile  />}  text='Profile'  href={`/profile/${state.currentUser.id}`} />
                            <SidebarOption icon={<FiSettings />}  text='Settings' href='/TODO' />
                            <SidebarOption icon={<BiLogOut   />}  text='Logout'   href='/logout'   />
                        </>
                    ) : (
                        <SignInButton
                            icon={<ImGithub />}
                            text='Sign in with Github'
                            href={`${API_URL}/oauth2/authorize/github?redirect_uri=${APP_URL}/oauth2/redirect`}
                        />
                    )}

                    <div className='flex-row theme-switch-wrapper'>
                        <div className='theme-switch' onClick={toggleTheme}>
                            <div className='switch'> </div>
                        </div>
                    </div>

                </div>
            </div>
            </div>
        </>
    )
}