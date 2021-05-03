import React, { createRef} from 'react'
import {useDropzone} from 'react-dropzone'
import Agent from '../api/Agent'
import { toast } from 'react-toastify';
import { useHistory } from 'react-router-dom';
import { ButtonSubmit} from './ButtonSubmit';

export const PostUploadForm: React.FC = () => {
    const {getRootProps, getInputProps, acceptedFiles} = useDropzone()
    const history   = useHistory();
    const submitRef = createRef<HTMLDivElement>();
    const titleRef  = createRef<HTMLInputElement>();
    const btnRef    = createRef<HTMLButtonElement>();


    const post = () => {
        const formData = new FormData();
        const title = titleRef.current?.value;

        if (!title ||  !title.trim().length) {
            toast.error('title cannot be empty!')
            return
        }

        if (acceptedFiles.length < 1) {
            toast.error('you must attach file!')
            return;
        }

        if (submitRef.current?.classList.contains('is-loading'))
            return;

        btnRef.current?.classList.add('loading')

        formData.append('file', acceptedFiles[0])
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
            .finally(() => btnRef.current?.classList.remove('loading'))
    }

    const files = acceptedFiles.map((file, index) => (
        <img key={index} alt="preview" src={URL.createObjectURL(file)}/>
    ));

    return (
        <div className='upload-form_wrapper'>
            <div className='upload-form'>
                <span className='upload-form_title'>Upload File</span>
                <div>
                    <input
                        className='upload-form-input_title'
                        ref={titleRef}
                        type="text"
                        placeholder='Podaj tytul'
                    />
                </div>

                {files.length === 0 ? (
                    <div className='upload-form-input_file' {...getRootProps()}>
                        <input {...getInputProps()} />
                        <p>Drag and drop here</p>
                        <p>or</p>
                        <p>Browse files</p>
                    </div>
                ) : (
                    <div className='upload-form-input_preview'>
                        {files}
                    </div>
                )}

                <div ref={submitRef} className='upload-form-input_submit'>
                    <ButtonSubmit ref={btnRef} text={'Submit'} onClick={post} />
                </div>

            </div>
        </div>
    )
}