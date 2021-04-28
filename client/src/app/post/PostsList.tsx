import Api from '../api/Api';
import { useEffect, useState } from 'react';
import { IPost } from '../model/IPost';
import InfiniteScroll from "react-infinite-scroll-component";
import Masonry from 'react-masonry-css'

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

export const PostsList = () => {
    const [posts, setPosts] = useState<IPost[]>([]);

    const fetchData = async() => {
        return await Api.Post.getList(offset++, 20);
    };

    useEffect(() => {
        let isMounted = true;
        fetchData().then(data => {
            if (isMounted) setPosts(arr => [...arr, ...data]);
        })
        return () => {isMounted = false}
    }, [])

    return (
        <InfiniteScroll
            dataLength={posts.length}
            next={() => fetchData().then(data => setPosts(arr => [...arr, ...data]))}
            hasMore={true}
            loader={<h4>Loading...</h4>}
        >
            <div className='grid-wrapper'>
                <Masonry
                    breakpointCols={breakpointColumnsObj}
                    className="my-masonry-grid"
                    columnClassName="my-masonry-grid_column"
                >
                    {
                        posts.map(post =>
                            <div key={post.id} className='grid-item'>
                                <img alt="" src={API_URL + '/img/' + post.imagePath}/>
                            </div>
                        )
                    }
                </Masonry>
            </div>
        </InfiniteScroll>
    )
}