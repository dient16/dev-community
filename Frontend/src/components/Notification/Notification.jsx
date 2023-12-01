import { useState } from 'react';
import './Notification.scss';
import NotifyItem from './NotifyItem';
import clsx from 'clsx';

const Notification = ({ data, setIsShowNotify }) => {
    const [notifyType, setNotifyType] = useState('all');
    return (
        <div className="notification">
            <div className="notification__top">
                <h3 className="title">Notification</h3>
                <div className="header-notify">
                    <span
                        className={clsx('header-notify__item', notifyType === 'all' && 'header-notify__item--active')}
                        onClick={() => setNotifyType('all')}
                    >
                        All activity
                    </span>
                    <span
                        className={clsx('header-notify__item', notifyType === 'like' && 'header-notify__item--active')}
                        onClick={() => setNotifyType('like')}
                    >
                        Likes
                    </span>
                    <span
                        className={clsx(
                            'header-notify__item',
                            notifyType === 'follow' && 'header-notify__item--active',
                        )}
                        onClick={() => setNotifyType('follow')}
                    >
                        Follow
                    </span>
                    <span
                        className={clsx('header-notify__item', notifyType === 'post' && 'header-notify__item--active')}
                        onClick={() => setNotifyType('post')}
                    >
                        Post
                    </span>
                    <span
                        className={clsx(
                            'header-notify__item',
                            notifyType === 'comment' && 'header-notify__item--active',
                        )}
                        onClick={() => setNotifyType('comment')}
                    >
                        Comments
                    </span>
                </div>
            </div>
            <div className="notification__body">
                {data.length > 0 &&
                    data.map((notify, index) => {
                        if (notify.type === notifyType || notifyType === 'all') {
                            return <NotifyItem notify={notify} key={index} setIsShowNotify={setIsShowNotify} />;
                        }
                    })}
            </div>
        </div>
    );
};

export default Notification;
