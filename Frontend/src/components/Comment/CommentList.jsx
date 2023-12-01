import { CommentItem } from '..';

const CommentList = ({ postId, comments, setIsOpenAuthModal }) => {
    return (
        <>
            {(comments || [])?.map((comment) => (
                <CommentItem
                    key={comment._id}
                    postId={postId}
                    commentId={comment._id}
                    content={comment.content}
                    createdAt={comment.createdAt}
                    author={comment.author}
                    likeCount={comment.likeCount}
                    isLiked={comment.isLiked}
                    replyCount={comment.replyCount}
                    parentId={comment.parentId}
                    setIsOpenAuthModal={setIsOpenAuthModal}
                />
            ))}
        </>
    );
};

export default CommentList;
