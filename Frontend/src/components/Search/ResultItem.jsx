import { Avatar, Flex } from 'antd';
import './Search.scss';
import moment from 'moment';
import { Link, useNavigate } from 'react-router-dom';

const ResultItem = ({
   avatar,
   createdAt,
   authorName,
   contentPost,
   username,
   postId,
   setIsOpenResult,
   setIsShowSearch,
}) => {
   const navigate = useNavigate();
   return (
      <div
         className="result-item"
         onClick={(e) => {
            navigate(`/post/${username}/${postId}`);
            e.stopPropagation();
            setIsOpenResult(false);
            setIsShowSearch(false);
         }}
      >
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
            onClick={() => {
               setIsOpenResult(false);
               setIsShowSearch(false);
            }}
         >
            {contentPost}
         </Link>
      </div>
   );
};

export default ResultItem;
