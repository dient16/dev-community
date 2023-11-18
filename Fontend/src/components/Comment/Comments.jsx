import { useEffect, useState } from 'react';
import './Comment.scss';
import { UserOutlined } from '@ant-design/icons';
import { Avatar, Input, Tree, Flex, message } from 'antd';
import { apiAddComment, apiGetReliedComment } from '~/apiServices';
import { Button, CommentItem } from '~/components';
import { ClipLoader } from 'react-spinners';
import icons from '~/utils/icons';
const Comments = ({ commentList, postId }) => {
    const [comments, setComments] = useState([]);
    const [textComment, setTextComment] = useState(null);
    const { MdOutlineKeyboardArrowUp, MdOutlineKeyboardArrowDown } = icons;
    const renderComments = () =>
        commentList?.filter((comment) => !comment.parentId)?.map((comment) => objectNodeComment(comment));
    const objectNodeComment = (comment, contentParent) => ({
        title: (
            <CommentItem
                key={comment._id}
                commentId={comment._id}
                content={comment.content}
                createdAt={comment.createdAt}
                author={comment.author}
                contentParent={contentParent}
            />
        ),
        key: comment._id,
        switcherIcon: (status) => {
            if (comment.replyCount === 0) {
                return null;
            }
            if (status.loading) {
                return <ClipLoader cssOverride={{ width: '20px', height: '20px' }} />;
            }
            if (!status.expanded) {
                return (
                    <Flex align="center">
                        <span>{`Show ${comment.replyCount} replied`}</span>
                        <MdOutlineKeyboardArrowUp size={20} />
                    </Flex>
                );
            }
            if (status.expanded) {
                return (
                    <Flex align="center">
                        <span>Hide replied</span>
                        <MdOutlineKeyboardArrowDown size={20} />
                    </Flex>
                );
            }
        },
    });
    const findAndAppendReplies = (list, key, children) =>
        list.map((node) => {
            if (node.key === key) {
                return {
                    ...node,
                    children,
                };
            }
            if (node.children) {
                return {
                    ...node,
                    children: findAndAppendReplies(node.children, key, children),
                };
            }
            return node;
        });

    const onLoadReplied = ({ key }) =>
        new Promise(async (resolve) => {
            const response = await apiGetReliedComment(key);
            if (response.status === 'success') {
                const replies = response?.repliedComments;
                const contentParent = response?.contentParent;
                setComments((origin) =>
                    findAndAppendReplies(
                        origin,
                        key,
                        replies.map((reply) => {
                            return objectNodeComment(reply, contentParent);
                        }),
                    ),
                );
            }
            resolve();
        });
    const handleAddComment = async () => {
        if (!textComment) {
            message.error('Comment empty');
            return;
        }
        const response = await apiAddComment(postId, { content: textComment });
        if (response.status === 'success') {
            const newComment = objectNodeComment(response.comment);
            setComments((prev) => [newComment, ...prev]);
            setTextComment(null);
        } else {
            message.error(response?.message);
        }
    };
    useEffect(() => {
        setComments(renderComments());
    }, [commentList]);

    return (
        <div className="comment-detail-post">
            <h2 className="comment-detail-post__title">Comments ({commentList?.length})</h2>
            <div className="comment-detail-post__body">
                <Flex gap={10}>
                    <Avatar size={30} icon={<UserOutlined />} />
                    <Input.TextArea
                        rows={4}
                        value={textComment}
                        placeholder="Add new comment"
                        onChange={(e) => setTextComment(e.target.value)}
                    />
                </Flex>
                <div>
                    <Button primary className="btn-comment" small onClick={() => handleAddComment()}>
                        Comment
                    </Button>
                </div>
                <div className="comment-detail-post__container">
                    <Tree loadData={onLoadReplied} showLine={true} defaultExpandAll={true} treeData={comments} />
                </div>
            </div>
        </div>
    );
};

export default Comments;
