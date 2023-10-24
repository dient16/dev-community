import React, { useEffect, useState } from 'react';
import './Post.scss';
import icons from '~/utils/icons';
import MDEditor from '@uiw/react-md-editor';
import moment from 'moment';
import { Button, Comment, TagChildren } from '~/components';
import { useParams } from 'react-router-dom';
import { apiGetPost } from '~/apiServices/post';
import { apiLikePost, apiUnlikePost } from '~/apiServices';
import { useSelector } from 'react-redux';
import clsx from 'clsx';

const Post = () => {
    const { FaRegHeart, FaHeart, RiChat1Line, FaRegBookmark } = icons;
    const [isLiked, setIsLiked] = useState(false);
    const { currentUser: user } = useSelector((state) => state.user);
    const [post, setPost] = useState(null);
    const { slug: pid } = useParams();
    const getPostDetail = async () => {
        const response = await apiGetPost(pid);
        if (response.status === 'success') {
            setPost(response.data);
        }
    };
    const handleToggleLike = async (e) => {
        e.stopPropagation();
        if (!isLiked) {
            const response = await apiLikePost(post._id);
            if (response.status === 'success') {
                setIsLiked(true);
                setPost(response?.post);
            }
        } else if (isLiked) {
            const response = await apiUnlikePost(post._id);
            if (response.status === 'success') {
                setIsLiked(false);
                setPost(response?.post);
            }
        }
    };
    useEffect(() => {
        getPostDetail();
        document.documentElement.setAttribute('data-color-mode', 'dark');
    }, []);
    useEffect(() => {
        const userLikePost = post?.likes.some((userId) => {
            console.log(userId);
            console.log('userId :', user?._id);
            return userId === user?._id;
        });
        console.log(userLikePost);
        setIsLiked(userLikePost);
    }, [post]);
    return (
        <div className="post-detail">
            <div className="post-detail__wrapper">
                <div className="post-detail__actions">
                    <span
                        className={clsx('post-detail__action-like', isLiked ? 'post-detail__action-like--active' : '')}
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
                        <img className="author-avatar" src={post?.author.avatar} alt="" />
                        <div className="author-wrap">
                            <span className="author-name">{`${post?.author?.firstname} ${post?.author?.lastname}`}</span>
                            <span className="author-post-time">{moment(post?.createAt).fromNow()}</span>
                        </div>
                    </div>
                    <h3 className="post-detail__body-title">{post?.title}</h3>
                    <div className="post-detail__body-tags">
                        {post?.tags.map((tag) => (
                            <TagChildren key={tag._id} tagName={tag.name} color={tag.theme} />
                        ))}
                    </div>
                    <div className="post-detail__content">
                        <MDEditor.Markdown
                            source={post?.body}
                            //style={{ whiteSpace: 'pre-wrap' }}
                        />
                    </div>
                    <Comment commentList={post?.comments} />
                </div>
                <div className="post-detail__author">
                    <div className="post-detail__author-top">
                        <div className="author-background">
                            <div className="avatar-info">
                                <img className="author-avatar" src={post?.author.avatar} alt="" />
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
