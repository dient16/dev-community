import './Notification.scss';
import moment from 'moment';
import { Avatar } from 'antd';
import { Link, useNavigate } from 'react-router-dom';

const NotifyItem = ({ notify, setIsShowNotify }) => {
    const navigate = useNavigate();
    if (notify.type === 'follow') {
        return (
            <div
                className="notification-item"
                onClick={(e) => {
                    e.stopPropagation();
                    setIsShowNotify(false);
                }}
            >
                <Avatar size={45} src={notify.sender?.avatar} />
                <div className="notification-item__content">
                    <Link
                        className="notification-item__sender-name"
                        to={`/${notify.sender?.username}`}
                        onClick={(e) => e.stopPropagation()}
                    >
                        {notify.sender?.username}
                    </Link>
                    <p className="notification-item__message">{`Follow you: ${moment(notify?.date).format(
                        'DD-MM-YYYY',
                    )}`}</p>
                </div>
                <div className="notification-item__action">
                    <button>Follow back</button>
                </div>
            </div>
        );
    }
    if (notify.type === 'like') {
        return (
            <div
                className="notification-item"
                onClick={() => {
                    navigate(`/post/${notify.receiver?.username}/${notify?.postId}`);
                    setIsShowNotify(false);
                }}
            >
                <Avatar size={45} src={notify.sender?.avatar} />
                <div className="notification-item__content">
                    <Link
                        className="notification-item__sender-name"
                        to={`/${notify.sender?.username}`}
                        onClick={(e) => {
                            e.stopPropagation();
                            setIsShowNotify(false);
                        }}
                    >
                        {notify.sender?.username}
                    </Link>
                    <p className="notification-item__message">{`Like your post: ${moment(notify?.date).format(
                        'DD-MM-YYYY',
                    )}`}</p>
                </div>
            </div>
        );
    }
    if (notify.type === 'comment') {
        return (
            <div
                className="notification-item"
                onClick={() => {
                    navigate(`/post/${notify.receiver?.username}/${notify?.postId}`);
                    setIsShowNotify(false);
                }}
            >
                <Avatar size={45} src={notify.sender?.avatar} />
                <div className="notification-item__content">
                    <Link
                        className="notification-item__sender-name"
                        to={`/${notify.sender?.username}`}
                        onClick={(e) => {
                            e.stopPropagation();
                            setIsShowNotify(false);
                        }}
                    >
                        {notify.sender?.username}
                    </Link>
                    <p className="notification-item__message">{`Comment your post: ${moment(notify?.date).format(
                        'DD-MM-YYYY',
                    )}`}</p>
                    <div className="notification-item__content-comment">{notify?.data}</div>
                </div>
            </div>
        );
    }
};

export default NotifyItem;
