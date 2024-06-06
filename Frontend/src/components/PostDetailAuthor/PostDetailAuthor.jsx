import { useContext, useState } from 'react';
import { Button } from '~/components';
import moment from 'moment';
import { Flex } from 'antd';
import './PostDetailAuthor.scss';
import { SocketContext } from '~/contexts/socketContext';
import { apiFollowUser, apiUnFollowUser } from '~/apiServices';
import { useMutation } from '@tanstack/react-query';
import { useAuth } from '~/hooks';
import { useNavigate } from 'react-router-dom';

const PostDetailAuthor = ({ author, setIsOpenAuthModal }) => {
    const socket = useContext(SocketContext);
    const [isFollow, setIsFollow] = useState(author?.isFollow);
    const navigate = useNavigate();
    const { user: currentUser, isLoggedIn } = useAuth();
    const followUserMutation = useMutation({
        mutationFn: apiFollowUser,
        onSuccess: () => {
            setIsFollow(true);
            socket.emit('follow', {
                sender: { id: currentUser?._id, username: currentUser?.username, avatar: currentUser?.avatar },
                receiver: { id: author?._id, username: author?.username, avatar: author?.avatar },
                date: Date.now(),
            });
        },
    });

    const unfollowUserMutation = useMutation({
        mutationFn: apiUnFollowUser,
        onSuccess: () => {
            setIsFollow(false);
        },
    });

    const toggleFollowUser = () => {
        if (!isLoggedIn) {
            setIsOpenAuthModal(true);
            return;
        }
        if (!isFollow) {
            followUserMutation.mutate(author._id);
        } else {
            unfollowUserMutation.mutate(author._id);
        }
    };

    return (
        <div className="post-detail__author">
            <div className="post-detail__author-top">
                <div className="author-background">
                    <div className="avatar-info">
                        <img
                            className="author-avatar"
                            src={author?.avatar}
                            alt=""
                            onClick={() => navigate(`/${author.username}`)}
                        />
                        <h3>{`${author?.firstname} ${author?.lastname}`}</h3>
                    </div>
                </div>
                {currentUser?._id === author?._id ? (
                    <div style={{ height: '60px' }}></div>
                ) : isFollow ? (
                    <Button
                        small
                        outline
                        className={'btn-follow'}
                        onClick={() => {
                            toggleFollowUser();
                        }}
                    >
                        Unfollow
                    </Button>
                ) : (
                    <Button
                        primary
                        small
                        className={'btn-follow'}
                        onClick={() => {
                            toggleFollowUser();
                        }}
                    >
                        Follow
                    </Button>
                )}

                <div className="post-detail__author-info">
                    <Flex vertical>
                        <span className="info-detail">{author?.bio}</span>
                    </Flex>
                    {author?.location && (
                        <Flex vertical>
                            <span className="info-title">LOCATION</span>
                            <span className="info-detail">{author?.location}</span>
                        </Flex>
                    )}
                    {author?.skills && (
                        <Flex vertical>
                            <span className="info-title">SKILLS</span>
                            <span className="info-detail">{author?.skills}</span>
                        </Flex>
                    )}
                    {author?.education && (
                        <Flex vertical>
                            <span className="info-title">EDUCATION</span>
                            <span className="info-detail">{author?.education}</span>
                        </Flex>
                    )}
                    {author?.education && (
                        <Flex vertical>
                            <span className="info-title">Work</span>
                            <span className="info-detail">{author?.work}</span>
                        </Flex>
                    )}
                    <Flex vertical>
                        <span className="info-title">JOINED</span>
                        <span className="info-detail">{moment(author?.createdAt).format('MMM D, YYYY')}</span>
                    </Flex>
                </div>
            </div>
            <div className="author-info"></div>
        </div>
    );
};

export default PostDetailAuthor;
