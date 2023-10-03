import React from 'react';
import './MyTags.scss';
import icons from '~/utils/icons';

const { RiSettingsLine } = icons;
const MyTags = () => {
    return (
        <div className="my-tags">
            <div className="my-tags__header">
                <span className="title">My tags</span>
                <span className="icon">
                    <RiSettingsLine />
                </span>
            </div>
            <div className="my-tags__container">
                <span>
                    <span className="tag-item">#reactjs</span>
                </span>
                <span>
                    <span className="tag-item">#nodejs</span>
                </span>
                <span>
                    <span className="tag-item">#html</span>
                </span>
                <span>
                    <span className="tag-item">#javascript</span>
                </span>
                <span>
                    <span className="tag-item">#reactjs</span>
                </span>
            </div>
        </div>
    );
};

export default MyTags;
