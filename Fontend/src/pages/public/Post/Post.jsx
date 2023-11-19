import { useEffect, useState, useRef } from 'react';
import './Post.scss';
import icons from '~/utils/icons';
import MDEditor from '@uiw/react-md-editor';
import moment from 'moment';
import { Comments, TagChildren, PostDetailAuthor } from '~/components';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery, useMutation } from '@tanstack/react-query';
import { Flex, Image, Spin, Tooltip } from 'antd';
import { apiGetPost, apiLikePost, apiUnlikePost } from '~/apiServices/post';
import clsx from 'clsx';
import { useAuth } from '~/hooks';

const Post = () => {
    const { FaRegHeart, FaHeart, RiChat1Line, FaRegBookmark } = icons;
    const navigate = useNavigate();
    const { slug } = useParams();
    const commentRef = useRef(null);
    const { user: currentUser } = useAuth();
    const {
        data,
        isLoading,
        refetch: refetchPost,
    } = useQuery({
        queryKey: ['post', slug],
        queryFn: () => apiGetPost(slug),
    });
    const post = data?.data;
    const [isLiked, setIsLiked] = useState(false);

    useEffect(() => {
        setIsLiked(post?.likes?.includes(currentUser?._id));
        document.documentElement.setAttribute('data-color-mode', 'dark');
    }, [post, currentUser?._id]);

    const likeMutation = useMutation({
        mutationFn: apiLikePost,
        onSuccess: () => {
            setIsLiked(true);
            refetchPost();
        },
    });

    const unLikeMutation = useMutation({
        mutationFn: apiUnlikePost,
        onSuccess: () => {
            setIsLiked(false);
            refetchPost();
        },
    });

    const handleToggleLike = (e) => {
        e.stopPropagation();
        const postId = post?._id;
        isLiked ? unLikeMutation.mutate(postId) : likeMutation.mutate(postId);
    };

    const handleScrollComment = () => {
        if (commentRef.current) {
            commentRef.current.scrollIntoView({ behavior: 'smooth' });
        }
    };

    return (
        <div className="post-detail">
            <div className="post-detail__wrapper">
                <div className="post-detail__actions">
                    <Flex vertical align="center">
                        <Tooltip title="Like">
                            <div
                                className={clsx(
                                    'post-detail__action-like',
                                    isLiked && 'post-detail__action-like--active',
                                )}
                                onClick={(e) => handleToggleLike(e)}
                            >
                                {isLiked ? <FaHeart color="#D71313" size={22} /> : <FaRegHeart size={25} />}
                            </div>
                        </Tooltip>
                        <span>{post?.likes.length}</span>
                    </Flex>
                    <Tooltip title="Comment">
                        <div className="post-detail__action-comment">
                            <i onClick={handleScrollComment}>
                                <RiChat1Line size={27} />
                            </i>
                            <span>{post?.comments.length}</span>
                        </div>
                    </Tooltip>
                    <Tooltip title="Bookmark">
                        <div className="post-detail__action-bookmark">
                            <FaRegBookmark size={24} />
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
                    <Spin spinning={isLoading} className="loading" fullscreen={isLoading}>
                        <div className="post-detail__content">
                            <MDEditor.Markdown source={post?.body} />
                        </div>
                    </Spin>
                    <div ref={commentRef}>
                        <Comments commentList={post?.comments} postId={post?._id} />
                    </div>
                </div>
                <PostDetailAuthor author={post?.author} />
            </div>
        </div>
    );
};

export default Post;
