import React, { useEffect, useState } from 'react';
import './MyTags.scss';
import icons from '~/utils/icons';
import { apiGetMyTags } from '~/apiServices';
import { useSelector } from 'react-redux';

const MyTags = () => {
    const { RiSettingsLine } = icons;
    const [myTags, setMyTags] = useState(null);
    const { currentUser } = useSelector((state) => state.user);
    const getMyTags = async () => {
        const response = await apiGetMyTags();
        if (response.status === 'success') {
            setMyTags(response.tags.followedTags);
        }
    };
    useEffect(() => {
        if (currentUser) {
            getMyTags();
        }
    }, []);
    return (
        <div className="my-tags">
            <div className="my-tags__header">
                <span className="title">My tags</span>
                <span className="icon">
                    <RiSettingsLine />
                </span>
            </div>
            <div className="my-tags__container">
                {myTags &&
                    myTags.map((tag) => {
                        return (
                            <span key={tag._id}>
                                <span className="my-tags__tag-item">{`#${tag.name}`}</span>
                            </span>
                        );
                    })}
            </div>
        </div>
    );
};

export default MyTags;
