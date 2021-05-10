import React, { Dispatch, SetStateAction, useContext, useState } from 'react';
import { IComment } from '../../model/IComment';
import { useHistory } from 'react-router-dom';
import { BsThreeDots } from 'react-icons/bs';
import TimeAgo from 'timeago-react';
import { Context } from '../../app/Store';
import { toast } from 'react-toastify';
import Agent from '../../api/Agent';
import { IPost } from '../../model/IPost';

interface IProps {
    post: IPost,
    comment: IComment,
    setPost: Dispatch<SetStateAction<IPost | undefined>>,
}

export const PostCardComment: React.FC<IProps> = ({ post, comment, setPost }) => {
    const history = useHistory();
    const {state} = useContext(Context);
    const [isMenuOn, setMenu] = useState(false);
    const deleteComment = () => {
        Agent.Comment.delete(comment.id + '')
            .then(() => {
                let na = [...post.comments];
                na.splice(na.findIndex(el => el && el.id === comment.id), 1)
                setPost(old => {
                    if (old)
                        return ({...old, comments: na})
                })
                toast.success('Comment deleted!');
            })
            .catch(err => {
                toast.error('Failed to delete comment!');
                console.log(err);
            })
    }
    return (
        <div className='flex-row post-right-comment'>
            <div className='post-right-comment-avatar'
                 onClick={() => history.push(`/profile/${comment.author.id}`)}
            >
                <img alt='' src={comment.author.avatarUrl}/>
            </div>

                <div className='flex-column post-right-comment-wrapper'>
                    <div className='flex-row'>
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
                        {state.currentUser?.id === comment.author.id && (
                            <span className='post-right-comment-dots' onClick={() => setMenu(!isMenuOn)}>
                                <BsThreeDots />
                                {isMenuOn && (
                                    <div className='post-right-comment-dots-menu-wrapper'>
                                        <div className='flex-column post-right-comment-dots-menu'>
                                            <span onClick={deleteComment}>Delete</span>
                                        </div>
                                    </div>
                                )}
                            </span>
                        )}
                    </div>
                    <div className='post-right-comment-content'>
                        {comment.content}
                    </div>
                </div>

        </div>
    )
}