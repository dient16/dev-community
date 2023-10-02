import React from 'react';
import './PostItem.scss';
import icons from '~/utils/icons';
const { FaRegHeart, FaRegBookmark, RiChat1Line } = icons;
const PostItem = () => {
    return (
        <div className="post-item">
            <img
                className="post-item__image"
                src="https://res.cloudinary.com/practicaldev/image/fetch/s--RmY6Zrlb--/c_imagga_scale,f_auto,fl_progressive,h_420,q_auto,w_1000/https://dev-to-uploads.s3.amazonaws.com/uploads/articles/hpa62sv1woh39hd65bcs.jpg"
                alt=""
            />
            <div className="post-item__body">
                <div className="post-item__content">
                    <div className="post-item__author">
                        <img
                            src="https://res.cloudinary.com/practicaldev/image/fetch/s--d7-icDZB--/c_fill,f_auto,fl_progressive,h_90,q_auto,w_90/https://dev-to-uploads.s3.amazonaws.com/uploads/user/profile_image/1168717/1fe46d48-beee-4dfc-ae8a-697de0470ef0.jpg"
                            alt=""
                            className="author-avatar"
                        />
                        <div className="post-author">
                            <span className="author-name">Dien t</span>
                            <span className="post-time">Oct 1 (21 hours ago)</span>
                        </div>
                    </div>
                    <div className="post-item__wrap-detail">
                        <p className="post-title">Meme Monday</p>
                        <div className="post-item__tags">
                            <span>#nextjs</span>
                            <span>#nextjs</span>
                            <span>#nextjs</span>
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
