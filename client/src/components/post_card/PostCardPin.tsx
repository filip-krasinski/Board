import React from 'react';
import { useHistory } from 'react-router-dom';
import { IAuthUser } from '../../model/IUser';

interface IProps {
    user: IAuthUser
}

export const PostCardPin: React.FC<IProps> = ({ user }) => {
    const history = useHistory();
    return (
        <div className='flex-row post-right-comment'>

            <div className='flex-column'>
                <div className='flex-row'>
                    <div className='post-right-comment-avatar'
                         onClick={() => history.push(`/profile/${user.id}`)}
                    >
                        <img alt='' src={user.avatarUrl}/>
                    </div>
                    <div className='post-right-comment-author'
                          onClick={() => history.push(`/profile/${user.id}`)}
                    >
                        {user.name}
                    </div>
                </div>
            </div>
        </div>
    )
}