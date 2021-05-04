import { RouteComponentProps } from 'react-router-dom'
import Agent from '../api/Agent';
import React, { createRef, useContext, useEffect, useState } from 'react';
import { IPost } from '../model/IPost';
import { toast } from 'react-toastify';
import { BsThreeDots } from 'react-icons/bs';
import { ButtonSubmit } from './ButtonSubmit';
import { PostCardComment } from './post_card/PostCardComment';
import { Context } from '../app/Store';
import { PostCardPin } from './post_card/PostCardPin';

interface MatchParams {
    id: string;
}


const API_URL = process.env.REACT_APP_API_URL;


enum Social {
    COMMENTS,
    PINS
}

export const Post = ({match}: RouteComponentProps<MatchParams>) => {
    const {state} = useContext(Context);
    const [social, setSocial]  = useState<Social>(Social.COMMENTS)
    const [post, setPost]      = useState<IPost | null>();
    const counterRef           = createRef<HTMLDivElement>();
    const refSocialPins        = createRef<HTMLDivElement>();
    const refSocialComments    = createRef<HTMLDivElement>();
    const inputRef             = createRef<HTMLTextAreaElement>();
    const btnRef               = createRef<HTMLButtonElement>();
    const [, setValue] = useState(0);

    const forceUpdate = () => {
        setValue(old => old+1)
    }

    const switchSocial = (social: Social) => {
        if (Social.COMMENTS === social) {
            refSocialPins.current?.classList.remove('active');
            refSocialComments.current?.classList.add('active');
        } else {
            refSocialPins.current?.classList.add('active');
            refSocialComments.current?.classList.remove('active');
        }
        setSocial(social)
    }

    const onType = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        if (counterRef.current)
            counterRef.current.innerText = e.currentTarget.value.length + '/512';
    }

    const postComment = () => {
        const content = inputRef.current?.value;

        if (!state.currentUser) {
            toast.error('You must be logged in!');
            return;
        }

        if (!post) {
            toast.error('Missing reference to post, try to refresh the page');
            return;
        }

        if (!content || !content.trim().length) {
            toast.error('Comment cannot be empty!')
            return;
        }

        btnRef.current?.classList.add('loading')

        Agent.Post.addComment(post.id, content)
            .then(res => {
                toast.success('Comment submitted!')
                post.comments.push(res)
                btnRef.current?.classList.remove('loading')
                if (inputRef.current)
                    inputRef.current.value = ''
                if (counterRef.current)
                    counterRef.current.innerText = '0/512'
                forceUpdate()
            })
            .catch(err => {
                toast.error("Failed to submit comment!");
                console.log(err)
            })
            .finally(() => btnRef.current?.classList.remove('loading'))
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

                                    <div className='post-right-dots'><BsThreeDots/></div>
                                </div>

                                <div className='flex-row'>
                                    <div className='post-right-title'>
                                        {post.title}
                                    </div>
                                </div>

                                <div className='flex-row post-right-socials'>
                                    <div className='post-right-socials-pins'
                                         ref={refSocialPins}
                                        onClick={() => switchSocial(Social.PINS)}
                                    >
                                        {post.pinnedBy.length} pins
                                    </div>
                                    <div
                                        ref={refSocialComments}
                                        className='post-right-socials-comments active'
                                         onClick={() => switchSocial(Social.COMMENTS)}
                                    >
                                        {post.comments.length} comments
                                    </div>
                                </div>


                                {Social.COMMENTS === social ? (
                                    <>
                                        <div className='flex-column post-right-comment-list'>
                                            {post.comments.map((com) => <PostCardComment key={com.id} comment={com}/>)}
                                        </div>
                                        <div className='flex-column post-right-input'>
                                            <div className='flex-row post-right-input'>
                                                <div className='post-right-input-avatar'>
                                                    <img alt='' src={post.author.avatarUrl}/>
                                                </div>
                                                <textarea
                                                    ref={inputRef}
                                                    onChange={(e) => onType(e)}
                                                    name="comment"
                                                    placeholder="Comment"
                                                    maxLength={512}
                                                    required
                                                />
                                            </div>
                                            <div className='flex-row post-right-input-submit'>
                                                <div ref={counterRef} className='post-right-input-counter'>
                                                    0/512
                                                </div>
                                                <div className=''>
                                                    <ButtonSubmit ref={btnRef} text={'Submit'} onClick={() => postComment()} />
                                                </div>
                                            </div>
                                        </div>
                                    </>
                                ) : (
                                 <>
                                     <div className='flex-column post-right-comment-list'>
                                         {post.pinnedBy.map((com) => <PostCardPin key={com.id} user={com}/>)}
                                     </div>
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