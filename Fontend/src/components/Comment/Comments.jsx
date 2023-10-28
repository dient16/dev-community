import React, { useEffect, useState } from 'react';
import './Comment.scss';
import { UserOutlined } from '@ant-design/icons';
import { Avatar, Input, Tree } from 'antd';
import moment from 'moment';
import { CommentItem } from '..';

const Comments = ({ commentList }) => {
    const [treeData, setTreeData] = useState([]);

    const renderComments = () =>
        commentList
            ?.filter((comment) => !comment.parentId)
            ?.map((comment) => ({
                title: (
                    <CommentItem
                        key={comment._id}
                        commentId={comment._id}
                        author={comment.author}
                        content={comment.content}
                        createdAt={comment.createdAt}
                        onShowReplies={handleShowReplies}
                    />
                ),
                key: comment._id,
            }));

    const findAndAppendReplies = (nodes, targetKey, replies) => {
        if (!nodes) {
            return nodes;
        }

        replies = Array.isArray(replies) ? replies : [replies];

        const traverseAndAppend = (nodes) =>
            nodes.map((node) => {
                if (!node || !node.key) {
                    console.error('Invalid node:', node);
                    return node;
                }

                if (node.key === targetKey) {
                    return {
                        ...node,
                        children: node.children ? [...node.children, ...replies] : [...replies],
                    };
                } else if (node.children) {
                    return {
                        ...node,
                        children: traverseAndAppend(node.children),
                    };
                }
                return node;
            });

        return traverseAndAppend([...nodes]);
    };

    const handleShowReplies = (parentCommentId, replies, setIsShowRelied) => {
        setTreeData((prevTreeData) => {
            return findAndAppendReplies(
                prevTreeData,
                parentCommentId,
                replies.map((reply) => {
                    console.log(reply._id);
                    return {
                        title: (
                            <CommentItem
                                key={reply._id}
                                commentId={reply._id}
                                content={reply.content}
                                createdAt={reply.createdAt}
                                author={reply.author}
                                onShowReplies={handleShowReplies}
                            />
                        ),
                        key: reply._id,
                    };
                }),
            );
        });
        setIsShowRelied(true);
    };

    useEffect(() => {
        setTreeData(renderComments());
    }, [commentList]);

    return (
        <div className="comment-detail-post">
            <h2 className="comment-detail-post__title">Comments ({commentList?.length})</h2>
            <div className="comment-detail-post__add-comment">
                <Avatar size={30} icon={<UserOutlined />} />
                <Input.TextArea rows={4} placeholder="Add new comment" />
            </div>
            <div className="comment-detail-post__container">
                <Tree showLine={false} treeData={treeData} />
            </div>
        </div>
    );
};

export default Comments;
