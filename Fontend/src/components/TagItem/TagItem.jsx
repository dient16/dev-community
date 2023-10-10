import React, { useEffect, useState } from 'react';
import './TagItem.scss';
import { Button } from '~/components';
import { apiFollowTag, apiUnfollowTag } from '~/apiServices';
import { useSelector } from 'react-redux';

const TagItem = ({ tag }) => {
    const [isFollowTag, setIsFollowTag] = useState(false);
    const { currentUser: user } = useSelector((state) => state.user);
    const toggleFollowTag = async () => {
        if (!isFollowTag) {
            const { _id: tagId } = tag;
            const response = await apiFollowTag(tagId);
            if (response.status === 'success') {
                setIsFollowTag(true);
            }
        } else if (isFollowTag) {
            const { _id: tagId } = tag;
            const response = await apiUnfollowTag(tagId);
            if (response.status === 'success') {
                setIsFollowTag(false);
            }
        }
    };

    useEffect(() => {
        const userFollowTag = tag?.followers.some((userId) => {
            return userId === user?._id;
        });
        setIsFollowTag(userFollowTag);
    }, []);
    return (
        <div className="tag-item">
            <div className="tag-item__top">
                <span className="tag-item__name">{`#${tag?.name}`}</span>
                <span className="tag-item__count-post">{`${tag?.posts?.length} post`}</span>
            </div>
            <div className="tag-item__bottom">
                <Button primary={!isFollowTag} small outline={isFollowTag} onClick={() => toggleFollowTag()}>
                    {isFollowTag ? 'Following' : 'Follow'}
                </Button>
            </div>
        </div>
    );
};

export default TagItem;
