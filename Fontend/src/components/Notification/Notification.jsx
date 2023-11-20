import React from 'react';
import './Notification.scss';
import NotifyItem from './NotifyItem';

const Notification = ({ data }) => {
    return (
        <div className="notification">
            <div className="notification__top">
                <h3 className="title">Notification</h3>
                <div className="header-notify">
                    <span className="header-notify__item header-notify__item--active">All activity</span>
                    <span className="header-notify__item">Likes</span>
                    <span className="header-notify__item">Follow</span>
                    <span className="header-notify__item">Post</span>
                    <span className="header-notify__item">Comments</span>
                </div>
            </div>
            <div className="notification__body">
                {data.length > 0 && data.map((notify, index) => <NotifyItem notify={notify} key={index} />)}
            </div>
        </div>
    );
};

export default Notification;
