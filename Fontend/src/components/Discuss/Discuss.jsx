import React from 'react';
import './Discuss.scss';
import { useQuery } from '@tanstack/react-query';
import { apiGetPostByTagDiscuss } from '~/apiServices';
import { Link } from 'react-router-dom';

const Discuss = () => {
    const { data, isLoading } = useQuery({
        queryKey: ['postByTag', 'discuss'],
        queryFn: apiGetPostByTagDiscuss,
    });
    return (
        <div className="discuss">
            <div className="discuss__title">#discuss</div>
            <div className="discuss__post-container">
                {data?.posts &&
                    data?.posts.map((post) => (
                        <div key={post?._id} className="discuss__post-item">
                            <Link className="post-item-title" to={`/post/${post?.author?.username}/${post?._id}`}>
                                {post?.title}
                            </Link>
                            <div className="post-item-comment">{`${post?.comments?.length} comment`}</div>
                        </div>
                    ))}
            </div>
        </div>
    );
};

export default Discuss;
