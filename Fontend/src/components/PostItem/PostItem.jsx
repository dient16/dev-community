import React, { useState } from 'react';
import './PostItem.scss';
import icons from '~/utils/icons';
import { useNavigate } from 'react-router-dom';
import moment from 'moment';
import { TagChildren } from '~/components';

const { FaRegHeart, FaHeart, FaRegBookmark, RiChat1Line } = icons;

const PostItem = ({ postItemOnHome, isLiked: isLikeProp, onToggleLike }) => {
    const navigate = useNavigate();
    const [isLiked, setIsLiked] = useState(isLikeProp);

    const handleToggleLike = (e) => {
        e.stopPropagation();
        onToggleLike(postItemOnHome._id, !isLiked, setIsLiked);
    };

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
                        <span onClick={handleToggleLike} className="like-inner">
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
