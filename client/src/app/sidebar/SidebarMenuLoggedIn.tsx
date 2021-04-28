import React from 'react';
import { IAuthUser } from '../model/IAuthUser';
import {ImGithub, ImHome} from 'react-icons/im'
import {CgProfile} from 'react-icons/cg'
import {IoMdAddCircle} from 'react-icons/io'
import {RiLogoutCircleLine} from 'react-icons/ri'
import {FiSettings} from 'react-icons/fi'
import { SignInButton } from '../login/SignInButton';

interface IProps {
    currentUser: IAuthUser | null,
    logout: () => void
}

const API_URL = process.env.REACT_APP_API_URL;
const APP_URL = process.env.REACT_APP_APP_URL;

export const SidebarMenuLoggedIn: React.FC<IProps> = ({ currentUser , logout}) => {

    return (
        <div className='flex-column'>
            <div className='sidebar-logo'>
                Board
            </div>

            {currentUser ? (
                <>
                    <div className='user-avatar'>
                        <img alt="" src={currentUser.avatarUrl} />
                    </div>
                    <div className='user-email'>
                        {currentUser.email}
                    </div>
                </>
            ) : null}


            <span className='sidebar-line' />

            <div className='flex-column-item'>
                <a href='/'>
                    <span className='icon'><ImHome /></span>
                    <span className='icon-text'>Home</span>
                </a>
            </div>

            <div className='flex-column-item'>
                <a href='/add_post'>
                    <span className='icon'><IoMdAddCircle /></span>
                    <span className='icon-text'>Upload</span>
                </a>
            </div>

            {currentUser ? (
                <>

                    <div className='flex-column-item'>
                        <a href='/TODO'>
                            <span className='icon'><CgProfile /></span>
                            <span className='icon-text'>Profile</span>
                        </a>
                    </div>

                    <div className='flex-column-item'>
                        <a href='/TODO'>
                            <span className='icon'><FiSettings /></span>
                            <span className='icon-text'>Settings</span>
                        </a>
                    </div>

                    <div className='flex-column-item'>
                        <a href='/add_post' onClick={logout}>
                            <span className='icon'><RiLogoutCircleLine /></span>
                            <span className='icon-text'>Logout</span>
                        </a>
                    </div>
                </>
            ) : (
                <>
                    <SignInButton
                        icon={<ImGithub />}
                        text='Sign in with Github'
                        redirect={API_URL + '/oauth2/authorize/github?redirect_uri=' + APP_URL + '/oauth2/redirect'}
                    />
                </>
            )}
        </div>
    )
}