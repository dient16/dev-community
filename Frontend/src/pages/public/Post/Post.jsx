import { useEffect, useState, useRef } from 'react';
import './Post.scss';
import icons from '~/utils/icons';
import MDEditor from '@uiw/react-md-editor';
import moment from 'moment';
import { Comment, TagChildren, PostDetailAuthor, ModalRequireLogin } from '~/components';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery, useMutation } from '@tanstack/react-query';
import { Avatar, Flex, Image, Spin, Tooltip } from 'antd';
import { apiGetPost, apiLikePost, apiUnlikePost } from '~/apiServices/post';
import clsx from 'clsx';
import { useAuth } from '~/hooks';

const Post = () => {
    const { FaRegHeart, FaHeart, RiChat1Line, FaRegBookmark, FaBookmark } = icons;
    const navigate = useNavigate();
    const { slug } = useParams();
    const commentRef = useRef(null);
    const [isOpenAuthModal, setIsOpenAuthModal] = useState(false);
    const { isLoggedIn } = useAuth();
    const {
        data: { data: post } = {},
        isLoading,
        refetch: refetchPost,
    } = useQuery({
        queryKey: ['post', slug],
        queryFn: () => apiGetPost(slug),
    });

    useEffect(() => {
        document.documentElement.setAttribute('data-color-mode', 'light');
    }, []);

    const likeMutation = useMutation({
        mutationFn: apiLikePost,
    });

    const unLikeMutation = useMutation({
        mutationFn: apiUnlikePost,
    });

    const handleToggleLike = (e) => {
        if (!isLoggedIn) {
            setIsOpenAuthModal(true);
            return;
        }
        e.stopPropagation();
        const postId = post?._id;
        post?.isLiked
            ? unLikeMutation.mutate(postId, {
                  onSuccess: () => {
                      refetchPost();
                  },
              })
            : likeMutation.mutate(postId, {
                  onSuccess: () => {
                      refetchPost();
                  },
              });
    };

    const handleScrollComment = () => {
        if (commentRef.current) {
            commentRef.current.scrollIntoView({ behavior: 'smooth' });
        }
    };

    return (
        <Spin spinning={isLoading} fullscreen={isLoading} size="large">
            <div className="post-detail">
                <ModalRequireLogin open={isOpenAuthModal} setOpen={setIsOpenAuthModal} />
                <div className="post-detail__wrapper">
                    <div className="post-detail__actions">
                        <Flex vertical align="center">
                            <Tooltip title="Like">
                                <div
                                    className={clsx(
                                        'post-detail__action-like',
                                        post?.isLiked && 'post-detail__action-like--active',
                                    )}
                                    onClick={(e) => handleToggleLike(e)}
                                >
                                    {post?.isLiked ? <FaHeart color="#D71313" size={22} /> : <FaRegHeart size={25} />}
                                </div>
                            </Tooltip>

                            <span>{post?.likeCount}</span>
                            <Avatar.Group shape="circle" maxCount={4} size={20}>
                                {post?.likes &&
                                    post?.likes.map((like) => (
                                        <Tooltip key={like._id} title={like.username} placement="top">
                                            <Avatar src={like.avatar} />
                                        </Tooltip>
                                    ))}
                            </Avatar.Group>
                        </Flex>
                        <Tooltip title="Comment">
                            <div className="post-detail__action-comment">
                                <i onClick={handleScrollComment}>
                                    <RiChat1Line size={27} />
                                </i>
                                <span>{post?.commentCount}</span>
                            </div>
                        </Tooltip>
                        <Tooltip title="Bookmark">
                            <div className="post-detail__action-bookmark">
                                <i className={clsx('icon', (post?.isBookmarked || false) && 'icon--active')}>
                                    {post?.isBookmarked || false ? (
                                        <FaBookmark size={21} />
                                    ) : (
                                        <FaRegBookmark size={21} />
                                    )}
                                </i>
                            </div>
                        </Tooltip>
                    </div>
                    <div className="post-detail__body">
                        <Image className="post-detail__body-image" src={post?.image} preview={false} />
                        <div className="post-detail__body-author">
                            <img
                                className="author-avatar"
                                src={post?.author?.avatar}
                                alt=""
                                onClick={(e) => {
                                    e.stopPropagation();
                                    navigate(`/${post.author.username}`);
                                }}
                            />
                            <div className="author-wrap">
                                <span
                                    className="author-name"
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        navigate(`/${post.author.username}`);
                                    }}
                                >{`${post?.author?.firstname} ${post?.author?.lastname}`}</span>
                                <span className="author-post-time">{moment(post?.createdAt).fromNow()}</span>
                            </div>
                        </div>
                        <h3 className="post-detail__body-title">{post?.title}</h3>
                        <div className="post-detail__body-tags">
                            {post?.tags?.map((tag) => (
                                <TagChildren key={tag._id} tagName={tag.name} color={tag.theme} />
                            ))}
                        </div>

                        <div className="post-detail__content">
                            <MDEditor.Markdown source={post?.body} />
                        </div>

                        <div ref={commentRef}>
                            <Comment
                                postId={post?._id}
                                postAuthor={post?.author}
                                setIsOpenAuthModal={setIsOpenAuthModal}
                            />
                        </div>
                    </div>
                    <PostDetailAuthor author={post?.author} setIsOpenAuthModal={setIsOpenAuthModal} />
                </div>
            </div>
        </Spin>
    );
};

export default Post;
