import React, { useEffect, useState } from 'react';
import './PostItem.scss';
import icons from '~/utils/icons';
import { useNavigate } from 'react-router-dom';
import moment from 'moment';
import { useMutation } from '@tanstack/react-query';
import { apiLikePost, apiUnlikePost } from '~/apiServices';
import { TagChildren } from '~/components';
import { getFromLocalStorage } from '~/utils/helper';

const { FaRegHeart, FaHeart, FaRegBookmark, RiChat1Line } = icons;

const PostItem = ({ postItemOnHome }) => {
    const navigate = useNavigate();
    const { currentUser } = getFromLocalStorage('dev-community');

    const [isLiked, setIsLiked] = useState(null);

    const mutation = useMutation({
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
        const postId = postItemOnHome._id;
        if (!isLiked) {
            mutation.mutate(postId);
        } else {
            unLikeMutation.mutate(postId);
        }
    };

    useEffect(() => {
        const userLikePost = postItemOnHome?.likes.some((userId) => {
            return userId === currentUser?._id;
        });
        setIsLiked(userLikePost);
    }, []);

    return (
        <div
            className="post-item"
            onClick={() => navigate(`/post/${postItemOnHome.author.username}/${postItemOnHome._id}`)}
        >
            {postItemOnHome?.image && (
                <div className="post-item__image">
                    <img src={postItemOnHome.image} alt="" />
                </div>
            )}
            <div className="post-item__body">
                <div className="post-item__content">
                    <div className="post-item__author">
                        <img src={postItemOnHome.author.avatar} alt="" className="author-avatar" />
                        <div className="post-author">
                            <span className="author-name">{`${postItemOnHome?.author?.firstname} ${postItemOnHome?.author?.lastname}`}</span>
                            <span className="post-time">{moment(postItemOnHome.createdAt).fromNow()}</span>
                        </div>
                    </div>
                    <div className="post-item__wrap-detail">
                        <p className="post-title">{postItemOnHome.title}</p>
                        <div className="post-item__tags">
                            {postItemOnHome &&
                                postItemOnHome?.tags.map((tag) => (
                                    <TagChildren key={tag._id} tagName={tag?.name} color={tag?.theme} />
                                ))}
                        </div>
                    </div>
                </div>
                <div className="post-item__actions">
                    <div className="post-item__action-like">
                        <span onClick={(e) => handleToggleLike(e)} className="like-inner">
                            {isLiked ? <FaHeart color="#D71313" size={24} /> : <FaRegHeart size={21} />}
                            <span className="like-title">{`${postItemOnHome?.likes?.length} Likes`}</span>
                        </span>
                    </div>
                    <div className="post-item__action-comment">
                        <span className="comment-inner">
                            <span className="comment-icon">
                                <RiChat1Line size={24} />
                            </span>
                            <span className="comment-title">{`${postItemOnHome?.comments?.length} Comments`}</span>
                        </span>
                    </div>
                    <span className="post-item__action-bookmark">
                        <FaRegBookmark size={21} />
                    </span>
                </div>
            </div>
        </div>
    );
};

export default PostItem;
