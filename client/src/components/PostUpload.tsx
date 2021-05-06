import React, { ChangeEvent, createRef, ElementRef, useState } from 'react';
import { ButtonSubmit } from './ButtonSubmit';
import { EmojiPicker } from './EmojiPicker';
import { InputWithCounter, TextAreaWithCounter } from './input/InputsWithCounters';
import { Emoji } from 'emoji-mart/dist-es/utils/data';
import { toast } from 'react-toastify';
import Agent from '../api/Agent';
import { useHistory } from 'react-router-dom';

const TITLE_MAX_LENGTH = process.env.REACT_APP_MAX_TITLE_LENGTH;
const DESC_MAX_LENGTH = process.env.REACT_APP_MAX_DESC_LENGTH;
const APP_URL = process.env.REACT_APP_APP_URL;

export const PostUpload = () => {
    const history         = useHistory();
    const [file, setFile] = useState<File>();
    const titleRef        = createRef<ElementRef<typeof InputWithCounter>>();
    const lastInputField  = createRef<ElementRef<typeof TextAreaWithCounter>>();
    const buttonRef       = createRef<ElementRef<typeof ButtonSubmit>>();

    const imageChange = (e: ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files.length >= 0) setFile(e.target.files[0])
        else setFile(undefined)
    }

    const emojiSelected = (emoji: Emoji) => {
        if (lastInputField.current) {
            const content = lastInputField.current.getInput();
            // @ts-ignore
            let sym = emoji.unified.split('-')
            let codesArray: any[] = []
            sym.forEach(el => codesArray.push('0x' + el))
            let finalEmoji = String.fromCodePoint(...codesArray)

            if (content.length + finalEmoji.length < TITLE_MAX_LENGTH) {
                lastInputField.current.add(finalEmoji)
            }
        }
    }

    const post = () => {
        const formData = new FormData();
        const title = titleRef.current?.getInput();
        console.log(title)

        if (!title ||  !title.trim().length) {
            toast.error('title cannot be empty!')
            return
        }

        if (!file) {
            toast.error('you must attach file!')
            return;
        }

        if (buttonRef.current?.isLoading())
            return;

        buttonRef.current?.setLoading(true)

        formData.append('file', file)
        formData.append('title', title)

        Agent.Post.upload(formData)
            .then(res => {
                toast.success('Pin uploaded!')
                history.push(`/post/${res.id}`)
            })
            .catch(err => {
                toast.error("Failed to upload pin!");
                console.log(err)
            })
            .finally(() => buttonRef.current?.setLoading(false))
    }

    return (
        <div className='post-wrapper'>
            <div className='post'>
                <div className='flex-column'>
                    <div className='post-header'>Share a post</div>
                    <div className='post-below'>
                        <div className='post-left'>
                            {file ? (
                                <img alt='' src={URL.createObjectURL(file)}/>
                            ) : (
                                <img alt='' className='invertible' src={`${APP_URL}/assets/post_img_placeholder.jpg`}/>
                            )}
                        </div>
                        <div className='post-right'>

                            <div className='post-upload-input flex-column'>
                                <div className='post-upload-input-text'>Title</div>
                                <InputWithCounter ref={titleRef} max_chars={TITLE_MAX_LENGTH}/>
                            </div>

                            <div className='flex-column'>
                                <div className='post-upload-input-text'>Image</div>
                                <div className='post-upload-input-file flex-column'>
                                    <input type="file" onChange={(e) => imageChange(e)} />
                                    <span className='button'>Choose</span>

                                    <span className='label'>
                                        {file ? (file.name) : ('No file selected')}
                                    </span>
                                </div>
                            </div>

                            <div className='post-upload-input flex-column'>
                                <div className='post-upload-input-text'>Description</div>
                                <div style={{ width: '100%'}}>
                                    <TextAreaWithCounter ref={lastInputField} max_chars={DESC_MAX_LENGTH} />
                                </div>
                            </div>

                            <div className='flex-row post-right-input-submit'>
                                <div style={{marginLeft: 'auto'}}>
                                    <ButtonSubmit ref={buttonRef} text={'Share'} onClick={post} />
                                </div>
                                <EmojiPicker onSelect={emojiSelected} />
                            </div>

                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}