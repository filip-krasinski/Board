import React, { createRef, ElementRef, useContext, useEffect, useState } from 'react';
import { TextAreaWithCounter } from '../input/InputsWithCounters';
import { PostCardComment } from './PostCardComment';
import { RouteComponentProps } from 'react-router-dom';
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
    const {state}              = useContext(Context);
    const [social, setSocial]  = useState<Social>(Social.COMMENTS)
    const [post, setPost]      = useState<IPost>();
    const refSocialPins        = createRef<HTMLDivElement>();
    const refSocialComments    = createRef<HTMLDivElement>();
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

        if (!state.currentUser) {
            toast.error('You must be logged in!');
            return;
        }

        if (!post) {
            toast.error('Missing reference to post, try to refresh the page');
            return;
        }

        if (buttonRef.current?.isLoading())
            return;

        buttonRef.current?.setLoading(true)
        Agent.Post.addComment(post.id, content)
            .then(res => {
                toast.success('Comment submitted!')
                post.comments.splice(0, 0, res)

                buttonRef.current?.setLoading(false)
                if (commentInputRef.current)
                    commentInputRef.current.clear();

                setPost(old => {
                    if (old)
                        return ({ ...old, id: 0})
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


                                {Social.PINS === social ? (
                                    <div className='flex-column post-right-comment-list'>
                                        {post.pinnedBy.map((com) => <PostCardPin key={com.id} user={com}/>)}
                                    </div>
                                ) : (
                                    <>
                                        <div className='flex-column post-right-comment-list'>
                                            {post.comments.map((com) => <PostCardComment key={com.id} comment={com}/>)}
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