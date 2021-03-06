import React, { createRef, ElementRef, useContext, useEffect, useState } from 'react';
import { TextAreaWithCounter } from '../input/InputsWithCounters';
import { PostCardComment } from './PostCardComment';
import { RouteComponentProps, useHistory } from 'react-router-dom';
import { PostCardPin } from './PostCardPin';
import { Emoji } from 'emoji-mart/dist-es/utils/data';
import { EmojiPicker } from '../EmojiPicker';
import { ButtonSubmit } from '../ButtonSubmit';
import { BsThreeDots } from 'react-icons/bs';
import { Context } from '../../app/Store';
import { toast } from 'react-toastify';
import { IPost } from '../../model/IPost';
import Agent from '../../api/Agent';

const COMMENT_MAX_LENGTH = process.env.REACT_APP_MAX_COMMENT_LENGTH;
const API_URL = process.env.REACT_APP_API_URL;

interface MatchParams {
    id: string;
}

enum Social {
    COMMENTS,
    PINS
}

export const PostCard = ({ match }: RouteComponentProps<MatchParams>) => {
    const history              = useHistory();
    const {state}              = useContext(Context);
    const [social, setSocial]  = useState(Social.COMMENTS)
    const [post, setPost]      = useState<IPost>();
    const [utilMenuActive, setUtilMenuActive] = useState(false);
    const buttonRef            = createRef<ElementRef<typeof ButtonSubmit>>();
    const commentInputRef      = createRef<ElementRef<typeof TextAreaWithCounter>>();

    const emojiSelected = (emoji: Emoji) => {
        if (commentInputRef.current) {
            const content = commentInputRef.current.getInput();
            // @ts-ignore
            let sym = emoji.unified.split('-')
            let codesArray: any[] = []
            sym.forEach(el => codesArray.push('0x' + el))
            let finalEmoji = String.fromCodePoint(...codesArray)

            if (content.length + finalEmoji.length < COMMENT_MAX_LENGTH) {
                commentInputRef.current.add(finalEmoji)
            }
        }
    }

    const deletePost = () => {
        if (!post) {
            toast.error('Missing reference to post, try to refresh the page');
            return;
        }

        Agent.Post.delete(post.id + '')
            .then(() => {
                history.push('/');
                toast.success('Post deleted!');
            })
            .catch(err => {
                toast.error('Failed to delete post!');
                console.log(err);
            })

    }

    const postComment = () => {
        const content = commentInputRef.current?.getInput();

        if (!content || !content.trim().length) {
            toast.error('Comment cannot be empty!')
            return;
        }

        if (content.length > COMMENT_MAX_LENGTH) {
            toast.error('Comment is too long!')
            return;
        }

        if (!post) {
            toast.error('Missing reference to post, try to refresh the page');
            return;
        }

        if (buttonRef.current?.isLoading())
            return;

        buttonRef.current?.setLoading(true)
        Agent.Comment.add(post.id, content)
            .then(res => {
                toast.success('Comment submitted!')

                buttonRef.current?.setLoading(false)
                if (commentInputRef.current)
                    commentInputRef.current.clear();

                setPost(old => {
                    if (old)
                        return ({
                            ...old,
                            comments: [res, ...old.comments]
                        })
                })
            })
            .catch(err => {
                toast.error("Failed to submit comment!");
                console.log(err)
            })
            .finally(() => buttonRef.current?.setLoading(false))
    }

    useEffect(() => {
        let isMounted = true;
        Agent.Post.get(match.params.id)
            .then(res => {
                res.comments.sort((a, b) => b.id - a.id)
                if (isMounted) setPost(res)
            })
            .catch(err => {
                toast.error('Failed to fetch data!');
                console.log(err)
            })
        return () => { isMounted = false }
    }, [match.params.id])

    return (
        <>
            {post ? (
                <div className='post-wrapper'>
                    <div className='post'>
                        <div className='post-left'>
                            <img alt='' src={`${API_URL}/img/${post.imagePath}`}/>
                        </div>
                        <div className='post-right'>

                            <div className='flex-column post-right-column'>
                                <div className='flex-row'>
                                    <div className='post-right-author'>
                                        <div className='post-right-author-avatar'>
                                            <img alt='' src={post.author.avatarUrl}/>
                                        </div>
                                        <div className='post-right-author-name'>{post.author.name}</div>
                                    </div>

                                    <div className='post-right-dots'
                                        onClick={() => setUtilMenuActive(!utilMenuActive)}
                                    >
                                        <BsThreeDots/>
                                        {utilMenuActive && (
                                            <div className='post-right-dots-menu-wrapper'>
                                                <div className='flex-column post-right-dots-menu'>
                                                    <span className='flex-column post-right-dots-menu-item'>Download</span>
                                                    {post.author.id === state.currentUser?.id && (
                                                        <span className='flex-column post-right-dots-menu-item'
                                                            onClick={deletePost}
                                                        >Delete</span>
                                                    )}
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                </div>

                                <div className='flex-row'>
                                    <div className='post-right-title'>
                                        {post.title}
                                    </div>
                                </div>

                                <div className='flex-row post-right-socials'>
                                    <div className={`post-right-socials-pins ${Social.PINS === social ? 'active' : ''}`}
                                        onClick={() => setSocial(Social.PINS)}
                                    >
                                        {post.pinnedBy.length} pins
                                    </div>
                                    <div className={`post-right-socials-comments ${Social.COMMENTS === social ? 'active' : ''}`}
                                         onClick={() => setSocial(Social.COMMENTS)}
                                    >
                                        {post.comments.length} comments
                                    </div>
                                </div>


                                {Social.PINS === social ? (
                                    <div className='flex-column post-right-comment-list'>
                                        {post.pinnedBy.map((com) => <PostCardPin key={com.id} user={com}/>)}
                                    </div>
                                ) : (
                                    <>
                                        <div className='flex-column post-right-comment-list'>
                                            {post.comments.map((com) => <PostCardComment
                                                key={com.id}
                                                post={post}
                                                setPost={setPost}
                                                comment={com}/>
                                            )}
                                        </div>
                                        {state.currentUser ? (
                                            <div className='flex-column post-right-input'>
                                                <div className='flex-row post-right-input'>
                                                    <div className='post-right-input-avatar'>
                                                        <img alt='' src={post.author.avatarUrl}/>
                                                    </div>

                                                    <div style={{width: '100%'}}>
                                                        <TextAreaWithCounter ref={commentInputRef} max_chars={COMMENT_MAX_LENGTH} />
                                                    </div>

                                                </div>
                                                <div className='flex-row post-right-input-submit'>
                                                    <div style={{marginLeft:'auto'}}>
                                                        <ButtonSubmit ref={buttonRef} text={'Submit'} onClick={postComment} />
                                                    </div>
                                                    <EmojiPicker onSelect={emojiSelected} />
                                                </div>
                                            </div>
                                        ) : null }
                                    </>
                                )}

                            </div>

                        </div>
                    </div>
                </div>
            ) : (
                <>
                </>
            )}
        </>
    )
}