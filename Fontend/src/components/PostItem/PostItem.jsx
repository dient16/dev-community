import { useState } from 'react';
import './PostItem.scss';
import icons from '~/utils/icons';
import { useNavigate } from 'react-router-dom';
import moment from 'moment';
import { ModalRequireLogin, TagChildren } from '~/components';
import { useAuth } from '~/hooks';
import clsx from 'clsx';

const { FaRegHeart, FaHeart, FaRegBookmark, RiChat1Line, FaBookmark } = icons;

const PostItem = ({ postItemOnHome, isLiked, onToggleLike, isBookmarked, onToggleBookmark }) => {
    const navigate = useNavigate();

    const [isOpenAuthModal, setIsOpenAuthModal] = useState(false);
    const { isLoggedIn } = useAuth();

    const handleToggleLike = (e) => {
        e.stopPropagation();
        if (!isLoggedIn) {
            setIsOpenAuthModal(true);
            return;
        }
        onToggleLike(postItemOnHome._id, isLiked);
    };

    const handleToggleBookmark = (e) => {
        e.stopPropagation();
        if (!isLoggedIn) {
            setIsOpenAuthModal(true);
            return;
        }
        onToggleBookmark(postItemOnHome._id, isBookmarked);
    };

    return (
        <>
            <ModalRequireLogin open={isOpenAuthModal} setOpen={setIsOpenAuthModal} />
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
                            <img
                                src={postItemOnHome.author.avatar}
                                alt=""
                                className="author-avatar"
                                onClick={(e) => {
                                    e.stopPropagation();
                                    navigate(`/${postItemOnHome.author.username}`);
                                }}
                            />
                            <div className="post-author">
                                <span
                                    className="author-name"
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        navigate(`/${postItemOnHome.author.username}`);
                                    }}
                                >{`${postItemOnHome?.author?.firstname} ${postItemOnHome?.author?.lastname}`}</span>
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
                                <span className="like-title">{`${postItemOnHome?.likeCount} Likes`}</span>
                            </span>
                        </div>
                        <div className="post-item__action-comment">
                            <span className="comment-inner">
                                <span className="comment-icon">
                                    <RiChat1Line size={24} />
                                </span>
                                <span className="comment-title">{`${postItemOnHome?.commentCount} Comments`}</span>
                            </span>
                        </div>
                        <span className="post-item__action-bookmark">
                            <i className={clsx('icon', isBookmarked && 'icon--active')} onClick={handleToggleBookmark}>
                                {isBookmarked ? <FaBookmark size={21} /> : <FaRegBookmark size={21} />}
                            </i>
                        </span>
                    </div>
                </div>
            </div>
        </>
    );
};

export default PostItem;
