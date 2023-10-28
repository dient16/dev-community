import React, { useState } from 'react';
import { Avatar, Flex } from 'antd';
import './Comment.scss';
import moment from 'moment';
import { apiGetReliedComment } from '~/apiServices';
const Comment = ({ commentId, author, content, createdAt, onShowReplies }) => {
    const [isShowRelied, setIsShowRelied] = useState(false);
    const handleShowReplies = async () => {
        if (isShowRelied) return;
        const response = await apiGetReliedComment({}, commentId);
        const replies = response?.repliedComment;
        onShowReplies(commentId, replies, setIsShowRelied);
    };
    return (
        <div className="comment-item">
            <Flex gap={2}>
                <Avatar size={30} src={author.avatar} />
                <div className="comment-item__inner">
                    <Flex gap="middle">
                        <span className="author-name">{`${author?.firstname} ${author?.lastname}`}</span>
                        <span>{moment(createdAt).fromNow()}</span>
                    </Flex>
                    <p className="comment-item__content">{content}</p>
                    <button onClick={handleShowReplies}>Show Replies</button>
                </div>
            </Flex>
        </div>
    );
};

export default Comment;
