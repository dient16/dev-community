import { useEffect, useState } from 'react';
import './TagItem.scss';
import { Button } from '~/components';
import { useMutation } from '@tanstack/react-query';
import { apiFollowTag, apiUnfollowTag } from '~/apiServices';
import { useAuth } from '~/hooks';

const TagItem = ({ tag }) => {
    const [isFollowTag, setIsFollowTag] = useState(false);
    const { user } = useAuth();

    const followTagMutation = useMutation({
        mutationFn: apiFollowTag,
        onSuccess: () => {
            setIsFollowTag(true);
        },
    });

    const unfollowTagMutation = useMutation({
        mutationFn: apiUnfollowTag,
        onSuccess: () => {
            setIsFollowTag(false);
        },
    });

    useEffect(() => {
        const userFollowTag = tag?.followers.some((userId) => userId === user?._id);
        setIsFollowTag(userFollowTag);
    }, []);

    const toggleFollowTag = () => {
        if (!isFollowTag) {
            followTagMutation.mutate(tag._id);
        } else {
            unfollowTagMutation.mutate(tag._id);
        }
    };

    return (
        <div className="tag-item">
            <div className="tag-item__top">
                <span className="tag-item__name">{`#${tag?.name}`}</span>
                <span className="tag-item__count-post">{`${tag?.posts?.length} post`}</span>
            </div>
            <div className="tag-item__bottom">
                <Button primary={!isFollowTag} small outline={isFollowTag} onClick={toggleFollowTag}>
                    {isFollowTag ? 'Following' : 'Follow'}
                </Button>
            </div>
        </div>
    );
};

export default TagItem;
