import { Avatar, Flex } from 'antd';
import './Search.scss';
import moment from 'moment';
import { Link } from 'react-router-dom';

const ResultItem = ({ avatar, createdAt, authorName, contentPost, username, postId, setIsOpenResult }) => {
    return (
        <div className="result-item" onClick={(e) => e.stopPropagation()}>
            <div className="result-item__author">
                <Avatar src={avatar} />
                <Flex vertical>
                    <span className="name">{authorName}</span>
                    <span className="createdAt">{moment(createdAt).fromNow()}</span>
                </Flex>
            </div>
            <Link
                className="result-item__content"
                to={`/post/${username}/${postId}`}
                onClick={() => setIsOpenResult(false)}
            >
                {contentPost}
            </Link>
        </div>
    );
};

export default ResultItem;
