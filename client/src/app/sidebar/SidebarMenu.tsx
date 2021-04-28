import { SidebarMenuLoggedIn } from './SidebarMenuLoggedIn';
import React, { createRef, useState } from 'react';
import { IAuthUser } from '../model/IAuthUser';
import { GiHamburgerMenu } from 'react-icons/gi'
import { ImCross } from 'react-icons/im'


interface IProps {
    user: IAuthUser | null,
    logout: () => void
}

export const SidebarMenu: React.FC<IProps>= ({ user, logout }) => {
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


            <div className='fixed'>
                <SidebarMenuLoggedIn
                    currentUser={user}
                    logout={logout}/>
            </div>
        </div>
        </>
    )
}