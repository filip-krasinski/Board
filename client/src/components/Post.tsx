import { RouteComponentProps } from "react-router-dom"
import Agent from '../api/Agent';
import { useEffect, useState } from 'react';
import { IPost } from '../model/IPoast';
import { toast } from 'react-toastify';

interface MatchParams {
    id: string;
}

export const Post = ({ match }: RouteComponentProps<MatchParams>) => {
    const [post, setPost] = useState<IPost | null>();

    useEffect(() => {
        Agent.Post.get(match.params.id)
            .then(setPost)
            .catch(err => {
                toast.error("Failed to fetch data!");
                console.log(err)
            })
    }, [])

    return(
        <>
            {post ? (
                <>
                    {post.title}
                </>
            ) : (
                <>
                </>
            )}
        </>
    )
}