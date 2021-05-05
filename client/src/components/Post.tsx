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
import 'emoji-mart/css/emoji-mart.css'
import { Picker } from 'emoji-mart'
import { Emoji } from 'emoji-mart/dist-es/utils/data';
import useOnClickOutside from '../util/useOnClickOutside';

const API_URL = process.env.REACT_APP_API_URL;

interface MatchParams {
    id: string;
}

enum Social {
    COMMENTS,
    PINS
}

export const Post = ({ match }: RouteComponentProps<MatchParams>) => {
    const {state}              = useContext(Context);
    const [social, setSocial]  = useState<Social>(Social.COMMENTS)
    const [post, setPost]      = useState<IPost>();
    const counterRef           = createRef<HTMLDivElement>();
    const refSocialPins        = createRef<HTMLDivElement>();
    const refSocialComments    = createRef<HTMLDivElement>();
    const picker               = createRef<HTMLDivElement>();
    const pickerWrapper        = createRef<HTMLDivElement>();
    const btnRef               = createRef<HTMLButtonElement>();
    const inputRef             = createRef<HTMLTextAreaElement>();

    useOnClickOutside(pickerWrapper, () => {
        if (picker.current)
            picker.current.style.display = 'none'
    });

    const toggleEmojiMenu = () => {
        if (picker.current)
            if (picker.current.style.display === 'none')
                picker.current.style.display = 'block'
            else
                picker.current.style.display = 'none'
    }

    const emojiSelected = (emoji: Emoji) => {
        if (inputRef.current) {
            // @ts-ignore
            let sym = emoji.unified.split('-')
            let codesArray: any[] = []
            sym.forEach(el => codesArray.push('0x' + el))
            let finalEmoji = String.fromCodePoint(...codesArray)
            if (inputRef.current.value.length + finalEmoji.length < 512) {
                inputRef.current.value += finalEmoji
                updateInput()
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

    const updateInput = () => {
        if (counterRef.current && inputRef.current)
            counterRef.current.innerText = inputRef.current.value.length + '/512';
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
                post.comments.splice(0, 0, res)
                btnRef.current?.classList.remove('loading')
                if (inputRef.current)
                    inputRef.current.value = ''
                if (counterRef.current)
                    counterRef.current.innerText = '0/512'

                setPost(old => {
                    if (old)
                        return ({ ...old, id: 0})
                })
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

                                                    <textarea
                                                        ref={inputRef}
                                                        onChange={() => updateInput()}
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
                                                    <div>
                                                        <ButtonSubmit ref={btnRef} text={'Submit'} onClick={() => postComment()} />
                                                    </div>
                                                    <div ref={pickerWrapper} style={{position: 'relative'}}>
                                                        <div ref={picker} style={{display:'none'}}>
                                                            <Picker
                                                                exclude={['flags']}
                                                                title=''
                                                                showSkinTones={false}
                                                                showPreview={false}
                                                                onClick={(emoji) => emojiSelected(emoji)}
                                                                style={{ position: 'absolute', bottom: '120px', right: '0', }} />
                                                        </div>

                                                        <span onClick={(e) => {
                                                            e.preventDefault()
                                                            toggleEmojiMenu()
                                                        }} className='emoji'>😊</span>
                                                    </div>
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