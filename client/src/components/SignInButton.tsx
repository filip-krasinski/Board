import React from 'react';

interface IProps {
    icon: any,
    text: string,
    href: string
}

export const SignInButton: React.FC<IProps> = ({ icon, text, href}) => {
    return (
        <div className='sidebar-column-item_custom'>
            <a href={href}>
                <div className='button-signIn'>
                    <div className='button-signIn_icon'>{icon}</div>
                    <div className='button-signIn_text'>{text}</div>
                </div>
            </a>
        </div>
    )
}