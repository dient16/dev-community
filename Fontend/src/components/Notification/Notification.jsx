import React from 'react';
import './Notification.scss';
const Notification = () => {
    return (
        <div className="notification">
            <div className="notification__top">
                <h3 className="title">Notification</h3>
                <div className="top-bar">
                    <span className="top-bar-item">All acivity</span>
                    <span className="top-bar-item">Likes</span>
                    <span className="top-bar-item">Comments</span>
                    <span className="top-bar-item">Post</span>
                </div>
                <div className="notification__body">
                    <div className="notification__item">
                        <img className="sender-avatar" src="" alt="" />
                        <div className="notification__content">
                            <div className="sender-name">Dient 16</div>
                            <div className="content">{`replied to your comment: hay qua 2023-8-10`}</div>
                            <div className="your-comment">{`duoc day`}</div>
                        </div>
                    </div>
                    <div className="notification__action">
                        <button>replied</button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Notification;
