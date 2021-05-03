import React, { useContext, useEffect, useState } from 'react';
import InfiniteScroll from 'react-infinite-scroll-component';
import Masonry from 'react-masonry-css'
import { IPost } from '../model/IPost';
import Agent from '../api/Agent';
import { Link } from 'react-router-dom';
import { AiFillPushpin } from 'react-icons/ai';
import { toast } from 'react-toastify';
import { Context } from '../app/Store';
import { history } from '../app/history';

let offset = 0;
const breakpointColumnsObj = {
    default: 7,
    2100: 6,
    1700: 5,
    1400: 4,
    1100: 3,
    700: 2,
    560: 1
};

const API_URL = process.env.REACT_APP_API_URL;

export const PostsGrid = () => {
    const {state} = useContext(Context);
    const [posts, setPosts] = useState<IPost[]>([]);

    const fetchData = async () => {
        return await Agent.Post.getList(offset++, 40);
    };

    const isPinned = (post: IPost) => {
        if (!state.currentUser) {
            return false;
        }
        return state.currentUser.pinned.some(p => p.id === post.id)
    }

    const pinPost = async (e: React.MouseEvent<HTMLSpanElement>, post: IPost) => {
        e.preventDefault()
        if (!state.currentUser) {
            toast.error('You must be logged in to to that!')
            return
        }

        if (!isPinned(post)) {
            Agent.User.pin(post.id)
                .then(() => {
                    state.currentUser?.pinned.push(post);
                    toast.success("Post pinned!")
                })
                .catch(err => {
                    toast.error("Failed to pin post!");
                    console.log(err)
                });

            (e.currentTarget as Element).classList.add('pinned');
        } else {
            Agent.User.unpin(post.id)
                .then(() => {
                    state.currentUser?.pinned.push(post);
                    toast.success("Post unpinned!")
                })
                .catch(err => {
                    toast.error("Failed to unpin post!");
                    console.log(err)
                });

            (e.currentTarget as Element).classList.remove('pinned');
        }
    }

    useEffect(() => {
        let isMounted = true;
        fetchData().then(data => {
            if (isMounted) setPosts(arr => [...arr, ...data]);
        })
        return () => { isMounted = false }
    }, [])

    return (
        <InfiniteScroll
            dataLength={posts.length}
            next={() => fetchData().then(data => setPosts(arr => [...arr, ...data]))}
            hasMore={true}
            loader={<h4>Loading...</h4>}
        >
            <div className='masonry-grid_wrapper'>
                <Masonry
                    breakpointCols={breakpointColumnsObj}
                    className='masonry-grid'
                    columnClassName='masonry-grid_column'
                >
                    {
                        posts.map(post =>
                            <Link key={post.id} to={`/post/${post.id}`}>
                                <div className='masonry-grid-item'>
                                    <img alt='' className='masonry-grid-item_bg' src={`${API_URL}/img/${post.imagePath}`}/>
                                    <div className='masonry-grid-item-overlay'>
                                        <div className='top-row'>
                                            <span className='masonry-grid-item-overlay_avatar'
                                                onClick={(e) => {
                                                    e.preventDefault();
                                                    history.push(`/profile/${post.author.id}`)
                                                }}
                                            >
                                                <img alt='' src={post.author.avatarUrl} />
                                            </span>
                                            <span className='masonry-grid-item-overlay_title'>
                                                {post.title}
                                            </span>
                                            <span
                                                onClick={(e) =>  pinPost(e, post)}
                                                className={`masonry-grid-item-overlay_icon${isPinned(post) ? ' pinned' : ''}`}>
                                                <AiFillPushpin/>
                                            </span>

                                        </div>
                                    </div>
                                </div>
                            </Link>
                        )
                    }
                </Masonry>
            </div>
        </InfiniteScroll>
    )
}