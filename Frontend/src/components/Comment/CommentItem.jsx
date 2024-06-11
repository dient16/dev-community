import { useState, useRef, useEffect } from 'react';
import { Avatar, Flex, Input, Button as ButtonAnt, message, Dropdown } from 'antd';
import './Comment.scss';
import moment from 'moment';
import icons from '~/utils/icons';
import { useAuth } from '~/hooks';
import { apiAddComment, apiDeleteComment, apiGetReliedComment, apiLikeComment, apiUnlikeComment } from '~/apiServices';
import CommentList from './CommentList';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
const {
    RiHeart2Fill,
    RiHeart2Line,
    RiChat1Line,
    HiOutlineDotsVertical,
    MdOutlineKeyboardArrowUp,
    MdOutlineKeyboardArrowDown,
} = icons;

const CommentItem = ({
    postId,
    author,
    content,
    commentId,
    parentId,
    createdAt,
    likeCount,
    isLiked,
    setIsOpenAuthModal,
    replyCount,
}) => {
    const [isShowInputReply, setIsShowInputReply] = useState(false);
    const [textReply, setTextReply] = useState('');
    const { isLoggedIn, user: currentUser } = useAuth();
    const [isShowRelies, setIsShowRelies] = useState(false);
    const queryClient = useQueryClient();
    const navigate = useNavigate();
    const inputReplyRef = useRef(null);
    const { data } = useQuery({
        queryKey: ['replies', commentId],
        queryFn: () => apiGetReliedComment(commentId),
        enabled: isShowRelies,
        staleTime: 1000 * 60 * 5,
    });
    const likeMutation = useMutation({ mutationFn: apiLikeComment });

    const unLikeMutation = useMutation({ mutationFn: apiUnlikeComment });
    const handleReply = async () => {
        if (!isLoggedIn) {
            setIsOpenAuthModal(true);
            return;
        }
        if (!textReply) {
            message.error('Reply empty');
            return;
        }
        const response = await apiAddComment(postId, {
            content: textReply,
            parentId: commentId,
        });
        if (response.status === 'success') {
            if (data?.repliedComments)
                queryClient.invalidateQueries({
                    queryKey: ['replies', commentId],
                });
            setTextReply('');
            setIsShowInputReply(false);
            setIsShowRelies(true);
        } else {
            message.error('Something went wrong');
        }
    };
    useEffect(() => {
        const handleScrollReply = () => {
            if (inputReplyRef.current) {
                inputReplyRef.current.scrollIntoView({ behavior: 'smooth' });
            }
        };
        handleScrollReply();
    }, [isShowInputReply]);
    const handleDeleteComment = async () => {
        const response = await apiDeleteComment(commentId);
        if (response.status === 'success') {
            queryClient.invalidateQueries({
                queryKey: ['comments', postId],
            });
            if (parentId)
                queryClient.invalidateQueries({
                    queryKey: ['replies', parentId],
                });
            message.success('Delete comment successfully');
        } else {
            message.error('Something went wrong');
        }
    };
    const handleToggleLikeComment = () => {
        if (!isLoggedIn) {
            setIsOpenAuthModal(true);
            return;
        }
        isLiked
            ? unLikeMutation.mutate(commentId, {
                  onSuccess: () => {
                      queryClient.invalidateQueries({
                          queryKey: ['comments', postId],
                      });
                      if (parentId)
                          queryClient.invalidateQueries({
                              queryKey: ['replies', parentId],
                          });
                  },
              })
            : likeMutation.mutate(commentId, {
                  onSuccess: () => {
                      queryClient.invalidateQueries({
                          queryKey: ['comments', postId],
                      });
                      if (parentId)
                          queryClient.invalidateQueries({
                              queryKey: ['replies', parentId],
                          });
                  },
              });
    };

    const items = [
        {
            key: '1',
            label: <div style={{ width: '100px' }}>Edit</div>,
        },
        {
            key: '2',
            label: (
                <div
                    style={{ width: '100px' }}
                    onClick={() => {
                        handleDeleteComment();
                    }}
                >
                    Delete
                </div>
            ),
        },
    ];

    return (
        <div className="comment-item">
            <Flex gap={4}>
                <Avatar size={30} src={author?.avatar} onClick={() => navigate(`/${author.username}`)} />
                <div className="comment-item__inner">
                    {currentUser?._id === author?._id && (
                        <div className="menu-comment">
                            <Dropdown menu={{ items }} placement="bottomRight" arrow trigger="click">
                                <div>
                                    <HiOutlineDotsVertical size={20} />
                                </div>
                            </Dropdown>
                        </div>
                    )}
                    <div className="comment-item__header">
                        <span
                            className="comment-item__author-name"
                            onClick={() => navigate(`/${author.username}`)}
                        >{`${author?.firstname} ${author?.lastname}`}</span>
                        <span>{moment(createdAt).format('DD MMM  YYYY, h:mm a')}</span>
                    </div>
                    <p className="comment-item__content">{content}</p>
                </div>
            </Flex>

            <Flex vertical>
                <div className="comment-item__bottom">
                    <div className="comment-item__actions">
                        <div>
                            <Flex align="center" gap={5} className="like" onClick={() => handleToggleLikeComment()}>
                                {isLiked ? <RiHeart2Fill size={20} color="#e50000" /> : <RiHeart2Line size={20} />}
                                <span>{`${likeCount} likes`}</span>
                            </Flex>
                        </div>
                        <div>
                            <Flex
                                align="center"
                                gap={5}
                                className="reply"
                                onClick={() => {
                                    setIsShowInputReply(true);
                                }}
                            >
                                <RiChat1Line size={20} />
                                <span>reply</span>
                            </Flex>
                        </div>
                    </div>

                    {!isShowRelies ? (
                        replyCount > 0 ? (
                            <div className="comment-item__reply-title" onClick={() => setIsShowRelies(true)}>
                                <span>{`Views ${replyCount} reply`}</span>
                                <MdOutlineKeyboardArrowDown size={15} />
                            </div>
                        ) : (
                            ''
                        )
                    ) : (
                        <div className="comment-item__reply-title" onClick={() => setIsShowRelies(false)}>
                            <span>{`Hide reply`}</span>
                            <MdOutlineKeyboardArrowUp size={15} />
                        </div>
                    )}
                </div>
                {isShowInputReply && (
                    <Flex align="end" vertical gap={5}>
                        <div ref={inputReplyRef} style={{ width: '96%' }}>
                            <Input.TextArea
                                className="reply-area"
                                rows={3}
                                value={textReply}
                                onChange={(e) => setTextReply(e.target.value)}
                            />
                        </div>
                        <Flex gap={5} align="center">
                            <ButtonAnt type="primary" ghost onClick={() => handleReply()}>
                                Reply
                            </ButtonAnt>
                            <ButtonAnt type="primary" danger ghost onClick={() => setIsShowInputReply(false)}>
                                Cancel
                            </ButtonAnt>
                        </Flex>
                    </Flex>
                )}
                {isShowRelies && data?.repliedComments?.length > 0 && (
                    <div className="comment-item__reply-list">
                        <CommentList comments={data?.repliedComments} postId={postId} />
                    </div>
                )}
            </Flex>
        </div>
    );
};

export default CommentItem;
