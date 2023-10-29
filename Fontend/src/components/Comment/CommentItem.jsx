import React, { useState } from 'react';
import { Avatar, Flex } from 'antd';
import './Comment.scss';
import moment from 'moment';
import icons from '~/utils/icons';

const Comment = ({ author, content, createdAt }) => {
    const { RiHeart2Fill, RiHeart2Line, RiChat1Line } = icons;

    return (
        <div className="comment-item">
            <Flex gap={2}>
                <Avatar size={30} src={author.avatar} />
                <div className="comment-item__inner">
                    <Flex gap="middle">
                        <span className="comment-item__author-name">{`${author?.firstname} ${author?.lastname}`}</span>
                        <span>{moment(createdAt).fromNow()}</span>
                    </Flex>
                    <p className="comment-item__content">{content}</p>
                </div>
            </Flex>
            <Flex>
                <div className="comment-item__actions">
                    <Flex align="center" gap={5}>
                        <RiHeart2Line size={20} />
                        <span>5 likes</span>
                    </Flex>
                    <Flex align="center" gap={5}>
                        <RiChat1Line size={20} />
                        <span>reply</span>
                    </Flex>
                </div>
            </Flex>
        </div>
    );
};

export default Comment;
