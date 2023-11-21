import { useState, useRef, useEffect } from 'react';
import { Avatar, Flex, Input, Button as ButtonAnt, message, Dropdown } from 'antd';
import './Comment.scss';
import moment from 'moment';
import icons from '~/utils/icons';
import { useAuth } from '~/hooks';
import { apiAddComment, apiDeleteComment } from '~/apiServices';

const CommentItem = ({
    postId,
    author,
    content,
    commentId,
    createdAt,
    contentParent,
    setIsOpenAuthModal,
    onRemove,
}) => {
    const { RiHeart2Fill, RiHeart2Line, RiChat1Line, BsReplyFill, HiOutlineDotsVertical } = icons;
    const [isShowInputReply, setIsShowInputReply] = useState(false);
    const [textReply, setTextReply] = useState('');
    const { isLoggedIn, user: currentUser } = useAuth();
    const btnReplyRef = useRef(null);
    const handleReply = async () => {
        if (!isLoggedIn) {
            setIsOpenAuthModal(true);
            return;
        }
        if (!textReply) {
            message.error('Reply empty');
            return;
        }
        const response = await apiAddComment(postId, { content: textReply, parentId: commentId });
        if (response.status !== 'success') {
            message.error('Something went wrong');
        }
    };
    useEffect(() => {
        const handleScrollReply = () => {
            if (btnReplyRef.current) {
                btnReplyRef.current.scrollIntoView({ behavior: 'smooth' });
            }
        };
        handleScrollReply();
    }, [isShowInputReply]);
    const handleDeleteComment = async () => {
        const response = await apiDeleteComment(commentId);
        if (response.status === 'success') {
            onRemove(commentId);
            message.success('Delete comment successfully');
        } else {
            message.error('Something went wrong');
        }
    };
    const items = [
        {
            key: '1',
            label: (
                <ButtonAnt type="primary" ghost style={{ width: '100%' }}>
                    Edit
                </ButtonAnt>
            ),
        },
        {
            key: '2',
            label: (
                <ButtonAnt
                    type="primary"
                    danger
                    ghost
                    style={{ width: '100%' }}
                    onClick={() => {
                        handleDeleteComment();
                    }}
                >
                    Delete
                </ButtonAnt>
            ),
        },
    ];

    return (
        <div className="comment-item">
            <Flex gap={2}>
                <Avatar size={30} src={author.avatar} />
                <div className="comment-item__inner">
                    {currentUser?._id === author?._id && (
                        <div className="menu-comment">
                            <Dropdown menu={{ items }} placement="bottomRight" arrow>
                                <ButtonAnt icon={<HiOutlineDotsVertical />} type="primary" ghost />
                            </Dropdown>
                        </div>
                    )}
                    <Flex gap={30}>
                        <Flex gap="middle">
                            <span className="comment-item__author-name">{`${author?.firstname} ${author?.lastname}`}</span>
                            <span>{moment(createdAt).fromNow()}</span>
                        </Flex>
                        {contentParent && (
                            <div className="comment-item__contentParent">
                                {`${contentParent}`} <BsReplyFill size={20} />
                            </div>
                        )}
                    </Flex>
                    <p className="comment-item__content">{content}</p>
                </div>
            </Flex>
            <Flex vertical>
                <div className="comment-item__actions">
                    <div>
                        <Flex align="center" gap={5} className="like">
                            <RiHeart2Line size={20} />
                            <span>0 likes</span>
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
                {isShowInputReply && (
                    <Flex align="end" vertical gap={5}>
                        <Input.TextArea
                            className="reply-area"
                            rows={3}
                            value={textReply}
                            onChange={(e) => setTextReply(e.target.value)}
                        />
                        <Flex gap={5} align="center">
                            <ButtonAnt type="primary" ghost ref={btnReplyRef} onClick={() => handleReply()}>
                                Reply
                            </ButtonAnt>
                            <ButtonAnt type="primary" danger ghost onClick={() => setIsShowInputReply(false)}>
                                Cancel
                            </ButtonAnt>
                        </Flex>
                    </Flex>
                )}
            </Flex>
        </div>
    );
};

export default CommentItem;
