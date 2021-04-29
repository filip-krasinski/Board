import React from 'react';
import { useHistory } from 'react-router-dom';

interface IProps {
    icon: any,
    href: string,
    text: string
}

export const SidebarOption: React.FC<IProps> = ({ icon, href, text }) => {
    const history = useHistory();
    return (
        <div className='flex-column-item'>
            <div className='flex-column-item-redirect-wrapper' onClick={() => {history.push(href)}}>
                <span className='icon'>{icon}</span>
                <span className='icon-text'>{text}</span>
            </div>
        </div>
    )
}