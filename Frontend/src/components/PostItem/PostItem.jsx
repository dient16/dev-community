import { useContext, useState } from 'react';
import './PostItem.scss';
import icons from '~/utils/icons';
import { useNavigate } from 'react-router-dom';
import moment from 'moment';
import { ModalRequireLogin, TagChildren } from '~/components';
import { useAuth } from '~/hooks';
import clsx from 'clsx';
import { apiBookmarkPost, apiLikePost, apiUnbookmarkPost, apiUnlikePost } from '~/apiServices';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { SocketContext } from '~/contexts/socketContext';
import MoonLoader from 'react-spinners/MoonLoader';

const { FaRegHeart, FaHeart, FaRegBookmark, RiChat1Line, FaBookmark } = icons;

const PostItem = ({ postItem }) => {
    const navigate = useNavigate();
    const { user: currentUser } = useAuth();
    const [isOpenAuthModal, setIsOpenAuthModal] = useState(false);
    const { isLoggedIn } = useAuth();
    const queryClient = useQueryClient();
    const socket = useContext(SocketContext);
    const likeMutation = useMutation({ mutationFn: apiLikePost });
    const unLikeMutation = useMutation({ mutationFn: apiUnlikePost });
    const bookmarkMutation = useMutation({ mutationFn: apiBookmarkPost });
    const unbookmarkMutation = useMutation({ mutationFn: apiUnbookmarkPost });
    const handleToggleLike = (e) => {
        e.stopPropagation();
        if (!isLoggedIn) {
            setIsOpenAuthModal(true);
            return;
        }
        const mutationAction = postItem?.isLiked ? unLikeMutation : likeMutation;
        mutationAction.mutate(postItem?._id, {
            onSuccess: (data) => {
                if (data.status === 'success') {
                    updatePostInQuery(data.post);
                    if (!postItem?.isLiked && currentUser._id !== data.post.author._id) {
                        socket.emit('like', {
                            sender: {
                                id: currentUser?._id,
                                username: currentUser?.username,
                                avatar: currentUser?.avatar,
                            },
                            receiver: {
                                id: data?.post?.author?._id,
                                username: data?.post?.author?.username,
                                avatar: data?.post?.author?.avatar,
                            },
                            postId: data?.post?._id,
                            date: Date.now(),
                        });
                    }
                }
            },
        });
    };
    const updatePostInQuery = (updatedPost) => {
        const queryKey =
            location.pathname === '/'
                ? ['post-home', '/']
                : location.pathname === '/top'
                  ? ['post-home', '/top']
                  : ['post-home', '/latest'];
        queryClient.setQueryData(queryKey, (prevData) => {
            const newPosts = prevData.pages.map((page) => ({
                ...page,
                posts: page.posts.map((post) => (post._id === updatedPost._id ? updatedPost : post)),
            }));

            return {
                ...prevData,
                pages: newPosts,
            };
        });
    };
    const handleToggleBookmark = (e) => {
        e.stopPropagation();
        if (!isLoggedIn) {
            setIsOpenAuthModal(true);
            return;
        }
        const bookmarkAction = postItem?.isBookmarked ? unbookmarkMutation : bookmarkMutation;
        bookmarkAction.mutate(postItem?._id, {
            onSuccess: (data) => {
                if (data.status === 'success') {
                    queryClient.invalidateQueries({
                        queryKey: ['currentUser'],
                    });
                    updatePostInQuery(data.post);
                }
            },
        });
    };
    return (
        <>
            <ModalRequireLogin open={isOpenAuthModal} setOpen={setIsOpenAuthModal} />
            <div className="post-item" onClick={() => navigate(`/post/${postItem?.author.username}/${postItem._id}`)}>
                {postItem?.image && (
                    <div className="post-item__image">
                        <img src={postItem.image} alt="" />
                    </div>
                )}
                <div className="post-item__body">
                    <div className="post-item__content">
                        <div className="post-item__author">
                            <img
                                src={postItem.author.avatar}
                                alt=""
                                className="author-avatar"
                                onClick={(e) => {
                                    e.stopPropagation();
                                    navigate(`/${postItem.author.username}`);
                                }}
                            />
                            <div className="post-author">
                                <span
                                    className="author-name"
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        navigate(`/${postItem.author.username}`);
                                    }}
                                >{`${postItem?.author?.firstname ? postItem.author.firstname : ''} ${
                                    postItem?.author?.lastname ? postItem.author.lastname : ''
                                }`}</span>
                                <span className="post-time">{moment(postItem.createdAt).fromNow()}</span>
                            </div>
                        </div>
                        <div className="post-item__wrap-detail">
                            <p className="post-title">{postItem.title}</p>
                            <div className="post-item__tags">
                                {postItem &&
                                    postItem?.tags.map((tag) => (
                                        <TagChildren key={tag._id} tagName={tag?.name} color={tag?.theme} />
                                    ))}
                            </div>
                        </div>
                    </div>
                    <div className="post-item__actions">
                        <div className="post-item__action-like">
                            <span onClick={handleToggleLike} className="like-inner">
                                {likeMutation.isPending || unLikeMutation.isPending ? (
                                    <MoonLoader size={15} />
                                ) : (
                                    <>
                                        {postItem?.isLiked ? (
                                            <FaHeart color="#D71313" size={24} />
                                        ) : (
                                            <FaRegHeart size={21} />
                                        )}
                                        <span className="like-title">{`${postItem?.likeCount} Likes`}</span>
                                    </>
                                )}
                            </span>
                        </div>
                        <div className="post-item__action-comment">
                            <span className="comment-inner">
                                <span className="comment-icon">
                                    <RiChat1Line size={24} />
                                </span>
                                <span className="comment-title">{`${postItem?.commentCount} Comments`}</span>
                            </span>
                        </div>
                        <span className="post-item__action-bookmark">
                            <i
                                className={clsx('icon', postItem?.isBookmarked && 'icon--active')}
                                onClick={handleToggleBookmark}
                            >
                                {postItem?.isBookmarked ? <FaBookmark size={21} /> : <FaRegBookmark size={21} />}
                            </i>
                        </span>
                    </div>
                </div>
            </div>
        </>
    );
};

export default PostItem;
