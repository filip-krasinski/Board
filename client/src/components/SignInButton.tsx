import React from 'react';
import './css/SignInButton.css'

interface IProps {
    icon: any,
    text: string,
    href: string
}

export const SignInButton: React.FC<IProps> = ({ icon, text, href}) => {
    return (
        <div className='flex-column-item-ignore'>
            <a className='width-reset' href={href}>
                <div className='singIn-button'>
                    <div className='singIn-button__icon'>
                        {icon}
                    </div>
                    <div className='singIn-button__text'>
                        {text}
                    </div>
                </div>
            </a>
        </div>
    )
}