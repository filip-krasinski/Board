import React from 'react';
import './SignInButton.css'

interface IProps {
    icon: any,
    text: string,
    redirect: string
}

export const SignInButton: React.FC<IProps> = ({ icon, text, redirect}) => {
    return (
        <div className='flex-column-item-ignore'>
            <a className='width-reset' href={redirect}>
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