import { useContext, useState } from 'react';
import './Comment.scss';
import { Avatar, Input, Flex, message } from 'antd';
import { apiAddComment, apiGetCommentPost } from '~/apiServices';
import { Button } from '~/components';
import { useAuth } from '~/hooks';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import CommentList from './CommentList';
import { SocketContext } from '~/contexts/socketContext';

const Comments = ({ postId, postAuthor, setIsOpenAuthModal }) => {
  const [textComment, setTextComment] = useState(null);
  const { isLoggedIn, user: currentUser } = useAuth();
  const socket = useContext(SocketContext);
  const queryClient = useQueryClient();
  const { data } = useQuery({
    queryKey: ['comments', postId],
    queryFn: () => apiGetCommentPost(postId),
  });

  const handleAddComment = async () => {
    if (!isLoggedIn) {
      setIsOpenAuthModal(true);
      return;
    }
    if (!textComment) {
      message.error('Comment empty');
      return;
    }
    const response = await apiAddComment(postId, { content: textComment });
    if (response.status === 'success') {
      queryClient.invalidateQueries({
        queryKey: ['comments', postId],
      });
      socket.emit('comment', {
        sender: { id: currentUser?._id, username: currentUser?.username, avatar: currentUser?.avatar },
        receiver: { id: postAuthor?._id, username: postAuthor?.username, avatar: postAuthor?.avatar },
        data: textComment,
        date: Date.now(),
      });
      setTextComment('');
    } else {
      message.error(response?.message);
    }
  };

  return (
    <div className="comment-detail-post">
      <h2 className="comment-detail-post__title">Comments ({data?.comments?.length})</h2>
      <div className="comment-detail-post__body">
        <Flex gap={5}>
          <Avatar size={30} src={postAuthor?.avatar} />
          <Input.TextArea
            rows={4}
            value={textComment}
            placeholder="Add new comment"
            className="comment-arial"
            onChange={(e) => setTextComment(e.target.value)}
          />
        </Flex>
        <div>
          <Button primary className="btn-comment" small onClick={() => handleAddComment()}>
            Comment
          </Button>
        </div>
        <div className="comment-detail-post__container">
          <CommentList comments={data?.comments} postId={postId} setIsOpenAuthModal={setIsOpenAuthModal} />
        </div>
      </div>
    </div>
  );
};

export default Comments;
