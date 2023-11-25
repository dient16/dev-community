import './Notification.scss';
import moment from 'moment';
import { Avatar } from 'antd';
import { Link, useNavigate } from 'react-router-dom';

const NotifyItem = ({ notify }) => {
    const navigate = useNavigate();
    if (notify.type === 'follow') {
        return (
            <div className="notification-item">
                <Avatar size={45} src={notify.sender?.avatar} />
                <div className="notification-item__content">
                    <Link className="notification-item__sender-name" to={`/${notify.sender?.username}`}>
                        {notify.sender.username}
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
                onClick={() => navigate(`/post/${notify.receiver?.username}/${notify?.postId}`)}
            >
                <Avatar size={45} src={notify.sender?.avatar} />
                <div className="notification-item__content">
                    <Link className="notification-item__sender-name" to={`/${notify.sender?.username}`}>
                        {notify.sender?.username}
                    </Link>
                    <p className="notification-item__message">{`Like your post: ${moment(notify?.date).format(
                        'DD-MM-YYYY',
                    )}`}</p>
                </div>
            </div>
        );
    }
};

export default NotifyItem;
