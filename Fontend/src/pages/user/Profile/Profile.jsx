import { Button, TagChildren } from '~/components';
import './Profile.scss';
import { Avatar, Flex, Spin } from 'antd';
import icons from '~/utils/icons';
import moment from 'moment';
import { useAuth } from '~/hooks';
import { path } from '~/utils/constant';
import { useParams } from 'react-router-dom';
import { useQuery, useMutation } from '@tanstack/react-query';
import { apiFollowUser, apiGetUserByUsername, apiUnFollowUser } from '~/apiServices';
import { useState, useEffect, useContext } from 'react';
import { SocketContext } from '~/contexts/socketContext';

const Profile = () => {
    const { BsFillPostcardFill, LuHash, FaBirthdayCake } = icons;
    const { username } = useParams();
    const socket = useContext(SocketContext);
    const [isFollow, setIsFollow] = useState(false);
    const { data: { userData: user } = { userData: null }, isLoading } = useQuery({
        queryKey: ['profile', username],
        queryFn: () => apiGetUserByUsername(username),
    });
    const { user: currentUser } = useAuth();
    const followUserMutation = useMutation({
        mutationFn: apiFollowUser,
        onSuccess: () => {
            setIsFollow(true);
            socket.emit('follow', {
                sender: { id: currentUser?._id, username: currentUser?.username, avatar: currentUser?.avatar },
                receiver: { id: user?._id, username: user?.username, avatar: user?.avatar },
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

    useEffect(() => {
        if (user?._id === currentUser?._id) return;
        const userFollow = user?.followers?.some((userId) => userId === currentUser?._id);
        setIsFollow(userFollow);
    }, [user, currentUser]);

    const toggleFollowUser = () => {
        if (!isFollow) {
            followUserMutation.mutate(user._id);
        } else {
            unfollowUserMutation.mutate(user._id);
        }
    };

    return (
        <>
            <Spin spinning={isLoading} fullscreen={true} size="large"></Spin>
            <div className="profile-user">
                <div className="profile-user__background"></div>
                <div className="profile-user__container">
                    <div className="profile-user__top">
                        <span className="avatar">
                            <Avatar src={user?.avatar} size={130} />
                        </span>
                        {currentUser?._id === user?._id ? (
                            <Button primary small className="edit-profile" to={`/${path.EDIT_PROFILE}`}>
                                Edit profile
                            </Button>
                        ) : isFollow ? (
                            <Button
                                small
                                outline
                                className="edit-profile"
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
                                className="edit-profile"
                                onClick={() => {
                                    toggleFollowUser();
                                }}
                            >
                                Follow
                            </Button>
                        )}

                        <h2 className="username">{`${user?.firstname} ${user?.lastname}`}</h2>
                        <p className="bio">{user?.bio}</p>
                        <Flex align="center" gap={10}>
                            <FaBirthdayCake size={20} />
                            <span className="join-date">
                                {`Joined on ${moment(user?.createdAt).format('MMMM Do, YYYY')}`}
                            </span>
                        </Flex>
                    </div>
                    <div className="profile-user__bottom">
                        <div className="slipt-left">
                            <Flex vertical gap={10}>
                                <Flex vertical className="card-skills">
                                    <span className="title-skills">Skills/Languages</span>
                                    <span className="content-skills">{user?.skills}</span>
                                </Flex>
                                <Flex vertical className="card-other">
                                    <Flex align="center" gap={15}>
                                        <BsFillPostcardFill size={20} />
                                        <span className="content">{`${user?.posts?.length} posts published`}</span>
                                    </Flex>
                                    <Flex align="center" gap={15}>
                                        <LuHash size={20} />
                                        <span className="content">{`${user?.followedTags?.length} tags followed`}</span>
                                    </Flex>
                                </Flex>
                            </Flex>
                        </div>
                        <div className="slipt-right">
                            {user?.posts &&
                                user?.posts?.map((post) => {
                                    return (
                                        <div className="my-post-item" key={post._id}>
                                            <div className="author">
                                                <Avatar src={user?.avatar} size={45} />
                                                <Flex vertical>
                                                    <span>{`${user?.firstname} ${user?.lastname}`}</span>
                                                    <span>Sep 1</span>
                                                </Flex>
                                            </div>
                                            <h3 className="title">{post?.title}</h3>
                                            <div className="">
                                                <Flex gap={10} wrap="wrap">
                                                    {post &&
                                                        post?.tags.map((tag) => (
                                                            <TagChildren
                                                                key={tag._id}
                                                                tagName={tag.name}
                                                                color={tag?.theme}
                                                            />
                                                        ))}
                                                </Flex>
                                            </div>
                                        </div>
                                    );
                                })}
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default Profile;
