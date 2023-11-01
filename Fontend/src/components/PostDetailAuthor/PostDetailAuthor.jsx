// PostDetailAuthor.js

import React from 'react';
import { Button } from '~/components';

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
                <div className="author-bio">{`LOCATION ${author?.location} PRONOUNS ${author?.pronouns} JOINED ${author?.joined}`}</div>
            </div>
            <div className="author-info"></div>
        </div>
    );
};

export default PostDetailAuthor;
