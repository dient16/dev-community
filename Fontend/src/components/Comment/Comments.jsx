import React, { useEffect, useState } from 'react';
import './Comment.scss';
import { UserOutlined } from '@ant-design/icons';
import { Avatar, Input, Tree, Flex } from 'antd';
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
    const objectNodeComment = (comment) => ({
        title: (
            <CommentItem
                key={comment._id}
                commentId={comment._id}
                content={comment.content}
                createdAt={comment.createdAt}
                author={comment.author}
            />
        ),
        key: comment._id,
        switcherIcon: (status) => {
            //console.log(status);
            if (status.loading) {
                return <ClipLoader cssOverride={{ width: '20px', height: '20px' }} />;
            }
            if (!status.expanded) {
                return (
                    <Flex align="center">
                        <span>Show replied</span>
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

    const onLoadReplied = ({ key, children }) =>
        new Promise(async (resolve) => {
            if (children) {
                resolve();
                return;
            }
            const response = await apiGetReliedComment({}, key);
            const replies = response?.repliedComment;
            setComments((origin) =>
                findAndAppendReplies(
                    origin,
                    key,
                    replies.map((reply) => {
                        return objectNodeComment(reply);
                    }),
                ),
            );
            resolve();
        });
    const handleAddComment = async () => {
        const response = await apiAddComment(postId, { content: textComment });
        const newComment = objectNodeComment(response.comment);
        setComments((prev) => [newComment, ...prev]);
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
