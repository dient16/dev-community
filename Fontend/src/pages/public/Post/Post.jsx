import React, { useEffect, useState } from 'react';
import './Post.scss';
import icons from '~/utils/icons';
import MDEditor from '@uiw/react-md-editor';
import moment from 'moment';
import { Button, Comments, TagChildren, Loading } from '~/components';
import { useParams } from 'react-router-dom';
import { useQuery, useMutation } from '@tanstack/react-query';
import { Spin } from 'antd';
import { apiGetPost, apiLikePost, apiUnlikePost } from '~/apiServices/post';
import clsx from 'clsx';
import { getFromLocalStorage } from '~/utils/helper';

const { FaRegHeart, FaHeart, RiChat1Line, FaRegBookmark } = icons;

const Post = () => {
    const { slug } = useParams();
    const { currentUser } = getFromLocalStorage('dev-community');

    const { data, isLoading } = useQuery({
        queryKey: ['post', slug],
        queryFn: () => apiGetPost(slug),
    });
    const post = data?.data;
    const [isLiked, setIsLiked] = useState(false);

    useEffect(() => {
        setIsLiked(post?.likes?.includes(currentUser._id));
        document.documentElement.setAttribute('data-color-mode', 'dark');
    }, [post, currentUser._id]);

    const likeMutation = useMutation({
        mutationFn: apiLikePost,
        onSuccess: (data) => {
            setIsLiked(true);
        },
    });

    const unLikeMutation = useMutation({
        mutationFn: apiUnlikePost,
        onSuccess: (data) => {
            setIsLiked(false);
        },
    });

    const handleToggleLike = (e) => {
        e.stopPropagation();
        const postId = post?._id;
        isLiked ? unLikeMutation.mutate(postId) : likeMutation.mutate(postId);
    };

    return (
        <div className="post-detail">
            <div className="post-detail__wrapper">
                <div className="post-detail__actions">
                    <span
                        className={clsx('post-detail__action-like', isLiked && 'post-detail__action-like--active')}
                        onClick={(e) => handleToggleLike(e)}
                    >
                        {isLiked ? <FaHeart color="#D71313" size={28} /> : <FaRegHeart size={28} />}
                    </span>
                    <span className="post-detail__action-comment">
                        <RiChat1Line size={31} />
                    </span>
                    <span className="post-detail__action-bookmark">
                        <FaRegBookmark size={28} />
                    </span>
                </div>
                <div className="post-detail__body">
                    <img className="post-detail__body-image" src={post?.image} alt="" />
                    <div className="post-detail__body-author">
                        <img className="author-avatar" src={post?.author?.avatar} alt="" />
                        <div className="author-wrap">
                            <span className="author-name">{`${post?.author?.firstname} ${post?.author?.lastname}`}</span>
                            <span className="author-post-time">{moment(post?.createdAt).fromNow()}</span>
                        </div>
                    </div>
                    <h3 className="post-detail__body-title">{post?.title}</h3>
                    <div className="post-detail__body-tags">
                        {post?.tags?.map((tag) => (
                            <TagChildren key={tag._id} tagName={tag.name} color={tag.theme} />
                        ))}
                    </div>
                    <Spin indicator={<Loading />} spinning={isLoading} className="loading">
                        <div className="post-detail__content">
                            <MDEditor.Markdown source={post?.body} />
                        </div>
                    </Spin>
                    <Comments commentList={post?.comments} />
                </div>
                <div className="post-detail__author">
                    <div className="post-detail__author-top">
                        <div className="author-background">
                            <div className="avatar-info">
                                <img className="author-avatar" src={post?.author?.avatar} alt="" />
                                <h3>{`${post?.author?.firstname} ${post?.author?.lastname}`}</h3>
                            </div>
                        </div>
                        <Button primary className={'btn-follow'}>
                            Follow
                        </Button>
                        <div className="author-bio">LOCATION Seoul, South Korea PRONOUNS he/him JOINED Jun 6, 2023</div>
                    </div>
                    <div className="author-info"></div>
                </div>
            </div>
        </div>
    );
};

export default Post;
