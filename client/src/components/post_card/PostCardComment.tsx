import React from 'react';
import { IComment } from '../../model/IComment';
import { useHistory } from 'react-router-dom';
import TimeAgo from 'timeago-react';

interface IProps {
    comment: IComment
}

export const PostCardComment: React.FC<IProps> = ({ comment }) => {
    const history = useHistory();
    return (
        <div className='flex-row post-right-comment'>
            <div className='post-right-comment-avatar'
                 onClick={() => history.push(`/profile/${comment.author.id}`)}
            >
                <img alt='' src={comment.author.avatarUrl}/>
            </div>

                <div className='flex-column post-right-comment-wrapper'>
                    <div>
                        <span className='post-right-comment-author'
                              onClick={() => history.push(`/profile/${comment.author.id}`)}
                        >
                            {comment.author.name}
                        </span>
                        <span className='post-right-comment-time'>

                            <TimeAgo
                                datetime={comment.creationTime}
                                opts={{minInterval: 10}}
                            />
                        </span>
                    </div>
                    <div className='post-right-comment-content'>
                        {comment.content}
                    </div>
                </div>

        </div>
    )
}