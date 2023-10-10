import React from 'react';
import './PostItem.scss';
import icons from '~/utils/icons';
import { useNavigate } from 'react-router-dom';
import moment from 'moment';
const { FaRegHeart, FaRegBookmark, RiChat1Line } = icons;

const PostItem = ({ post }) => {
    const navigate = useNavigate();
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
                            <span className="post-time">{moment(post.updatedAt).fromNow()}</span>
                        </div>
                    </div>
                    <div className="post-item__wrap-detail">
                        <p className="post-title">{post.title}</p>
                        <div className="post-item__tags">
                            {post?.tags.map((tag) => (
                                <span key={tag._id}>{`#${tag.name}`}</span>
                            ))}
                        </div>
                    </div>
                </div>
                <div className="post-item__actions">
                    <span className="action-like">
                        <FaRegHeart size={21} />
                        <span className="like-title">Like</span>
                    </span>
                    <div className="action-comment">
                        <span className="comment-icon">
                            <RiChat1Line size={24} />
                        </span>
                        <span className="comment-title">Comment</span>
                    </div>
                    <span className="action-bookmark">
                        <FaRegBookmark size={21} />
                    </span>
                </div>
            </div>
        </div>
    );
};

export default PostItem;
