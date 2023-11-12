import React from 'react';
import { Button } from '~/components';
import moment from 'moment';
import { Flex } from 'antd';
import './PostDetailAuthor.scss';

const PostDetailAuthor = ({ author }) => {
    return (
        <div className="post-detail__author">
            <div className="post-detail__author-top">
                <div className="author-background">
                    <div className="avatar-info">
                        <img className="author-avatar" src={author?.avatar} alt="" />
                        <h3>{`${author?.firstname} ${author?.lastname}`}</h3>
                    </div>
                </div>
                <Button primary className={'btn-follow'}>
                    Follow
                </Button>
                <div className="post-detail__author-info">
                    <Flex vertical>
                        <span className="info-detail">{author?.bio}</span>
                    </Flex>
                    {author?.location && (
                        <Flex vertical>
                            <span className="info-title">LOCATION</span>
                            <span className="info-detail">{author?.location}</span>
                        </Flex>
                    )}
                    {author?.skills && (
                        <Flex vertical>
                            <span className="info-title">SKILLS</span>
                            <span className="info-detail">{author?.skills}</span>
                        </Flex>
                    )}
                    {author?.education && (
                        <Flex vertical>
                            <span className="info-title">EDUCATION</span>
                            <span className="info-detail">{author?.education}</span>
                        </Flex>
                    )}
                    {author?.education && (
                        <Flex vertical>
                            <span className="info-title">Work</span>
                            <span className="info-detail">{author?.work}</span>
                        </Flex>
                    )}
                    <Flex vertical>
                        <span className="info-title">JOINED</span>
                        <span className="info-detail">{moment(author?.createdAt).format('MMM D, YYYY')}</span>
                    </Flex>
                </div>
            </div>
            <div className="author-info"></div>
        </div>
    );
};

export default PostDetailAuthor;
