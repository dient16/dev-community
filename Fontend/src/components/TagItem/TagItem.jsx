import React from 'react';
import './TagItem.scss';
import { Button } from '~/components';

const TagItem = () => {
    return (
        <div className="tag-item">
            <div className="tag-item__top">
                <span className="tag-item__name">#web dev</span>
                <span className="tag-item__count-post">131.845 post</span>
            </div>
            <div className="tag-item__bottom">
                <Button primary small>
                    Follow
                </Button>
            </div>
        </div>
    );
};

export default TagItem;
