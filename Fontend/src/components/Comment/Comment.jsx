import React from 'react';
import './Comment.scss';
import { UserOutlined, DownOutlined } from '@ant-design/icons';
import { Avatar, Input, Tree } from 'antd';
import moment from 'moment';

const Comment = ({ commentList }) => {
    const renderComments = (comments) =>
        comments?.map((comment) => {
            return (
                !comment?.parentId && {
                    title: (
                        <div className="comment-body">
                            <div className="author">
                                <Avatar size={30} src={comment?.author.avatar} />
                                <span className="author-name">{`${comment?.author?.firstname} ${comment?.author?.lastname}`}</span>
                                <span>{moment(comment?.date).fromNow()}</span>
                            </div>

                            <p className="comment-content">{comment?.content}</p>
                        </div>
                    ),
                    key: comment._id,
                }
            );
        });

    return (
        <div className="comment-post">
            <h2 className="comment-post__title">Comments ({commentList?.length})</h2>
            <div className="comment-post__add-comment">
                <Avatar size={30} icon={<UserOutlined />} />
                <Input.TextArea rows={4} placeholder="Add new comment" />
            </div>
            <div className="comment-post__container">
                <Tree showLine treeData={renderComments(commentList)} fieldNames={() => {}} />
            </div>
        </div>
    );
};

export default Comment;
