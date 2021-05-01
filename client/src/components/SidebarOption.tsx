import React from 'react';
import { Link } from 'react-router-dom';

interface IProps {
    icon: any,
    href: string,
    text: string
}

export const SidebarOption: React.FC<IProps> = ({ icon, href, text }) => {
    return (
        <div className='sidebar-column-item'>
            <Link className='sidebar-column-item_redirect' to={href}>
                <span className='sidebar-column-item_icon'>{icon}</span>
                <span className='sidebar-column-item_text'>{text}</span>
            </Link>
        </div>
    )
}