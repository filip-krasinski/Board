import React, { createRef} from 'react'
import {useDropzone} from 'react-dropzone'
import Agent from '../api/Agent'
import './css/PostUploadForm.css'

export const PostUploadForm: React.FC = () => {
    const {getRootProps, getInputProps, acceptedFiles} = useDropzone()
    const submitRef = createRef<HTMLDivElement>();
    const titleRef  = createRef<HTMLInputElement>();

    const post = () => {
        const formData = new FormData();
        const title = titleRef.current?.value;
        if (title === null || title === undefined || acceptedFiles.length < 1)
            return;

        formData.append('file', acceptedFiles[0])
        formData.append('title', title)

        Agent.Post.upload(formData)
    }

    const files = acceptedFiles.map((file, index) => (
        <img key={index} alt="preview" src={URL.createObjectURL(file)}/>
    ));

    return (
        <div className='upload-form-outer'>
            <div className='upload-form-inner'>

                <h2>Upload File</h2>

                <div>
                    <input
                        className='input-title'
                        ref={titleRef}
                        type="text"
                        placeholder='Podaj tytul'
                    />
                </div>

                {files.length === 0 ? (
                    <div className='input-file' {...getRootProps()}>
                        <input
                            {...getInputProps()} />
                        <p>Drag and drop here</p>
                        <p>or</p>
                        <p>Browse files</p>
                    </div>
                ) : (
                    <div className='input-preview'>
                        {files}
                    </div>
                )}

                <div
                    ref={submitRef}
                    className='submit'>
                    <button onClick={post}>Dodaj</button>
                </div>

            </div>
        </div>
    )
}