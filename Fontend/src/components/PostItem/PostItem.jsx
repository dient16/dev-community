import React, { useEffect, useState } from 'react';
import './PostItem.scss';
import icons from '~/utils/icons';
import { useNavigate } from 'react-router-dom';
import moment from 'moment';
import { apiLikePost, apiUnlikePost } from '~/apiServices';
import { useSelector } from 'react-redux';
import { TagChildren } from '~/components';
const { FaRegHeart, FaHeart, FaRegBookmark, RiChat1Line } = icons;

const PostItem = ({ postItemOnHome }) => {
    const navigate = useNavigate();
    const [isLiked, setIsLiked] = useState(false);
    const { currentUser: user } = useSelector((state) => state.user);
    const [post, setPost] = useState(postItemOnHome);
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
        const userLikePost = post?.likes.some((userId) => {
            return userId === user?._id;
        });
        setIsLiked(userLikePost);
    }, []);

    return (
        <div className="post-item" onClick={() => navigate(`/post/${post.author.username}/${post._id}`)}>
            {post?.image && (
                <div className="post-item__image">
                    <img src={post.image} alt="" />
                </div>
            )}
            <div className="post-item__body">
                <div className="post-item__content">
                    <div className="post-item__author">
                        <img src={post.author.avatar} alt="" className="author-avatar" />
                        <div className="post-author">
                            <span className="author-name">{`${post?.author?.firstname} ${post?.author?.lastname}`}</span>
                            <span className="post-time">{moment(post.createdAt).fromNow()}</span>
                        </div>
                    </div>
                    <div className="post-item__wrap-detail">
                        <p className="post-title">{post.title}</p>
                        <div className="post-item__tags">
                            {post &&
                                post?.tags.map((tag) => (
                                    <TagChildren key={tag._id} tagName={tag?.name} color={tag?.theme} />
                                ))}
                        </div>
                    </div>
                </div>
                <div className="post-item__actions">
                    <div className="post-item__action-like">
                        <span onClick={(e) => handleToggleLike(e)} className="like-inner">
                            {isLiked ? <FaHeart color="#D71313" size={24} /> : <FaRegHeart size={21} />}
                            <span className="like-title">{`${post?.likes?.length} Likes`}</span>
                        </span>
                    </div>
                    <div className="post-item__action-comment">
                        <span className="comment-inner">
                            <span className="comment-icon">
                                <RiChat1Line size={24} />
                            </span>
                            <span className="comment-title">{`${post?.comments?.length} Comments`}</span>
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
