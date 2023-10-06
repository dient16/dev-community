import React from 'react';
import './Notification.scss';
const Notification = () => {
    return (
        <div className="notification">
            <div className="notification__top">
                <h3 className="title">Notification</h3>
                <div className="header-notify">
                    <span className="header-notify__item header-notify__item--active">All activity</span>
                    <span className="header-notify__item">Likes</span>
                    <span className="header-notify__item">Comments</span>
                    <span className="header-notify__item">Post</span>
                </div>
            </div>
            <div className="notification__body">
                <div className="notification-item">
                    <img
                        className="notification-item__sender-avatar"
                        src="https://pgddttieucan.edu.vn/wp-content/uploads/2022/09/1663047926_941_Bo-suu-tap-31-anh-anime-avt-moi-cap-nhat.jpeg"
                        alt=""
                    />
                    <div className="notification-item__content">
                        <a className="notification-item__sender-name" href="https://github.com/dient16/dev-community">
                            Dient 16
                        </a>
                        <p className="notification-item__message">{`replied to your comment: hay qua 2023-8-10: duoc day`}</p>
                    </div>
                    <div className="notification-item__action">
                        <button>replied</button>
                    </div>
                </div>
                <div className="notification-item">
                    <img
                        className="notification-item__sender-avatar"
                        src="https://pgddttieucan.edu.vn/wp-content/uploads/2022/09/1663047926_941_Bo-suu-tap-31-anh-anime-avt-moi-cap-nhat.jpeg"
                        alt=""
                    />
                    <div className="notification-item__content">
                        <a className="notification-item__sender-name" href="https://github.com/dient16/dev-community">
                            Dient 16
                        </a>
                        <p className="notification-item__message">{`replied to your comment: hay qua 2023-8-10: duoc day`}</p>
                    </div>
                    <div className="notification-item__action">
                        <button>replied</button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Notification;
