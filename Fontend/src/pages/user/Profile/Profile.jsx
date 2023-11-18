import { Button, TagChildren } from '~/components';
import './Profile.scss';
import { Avatar, Flex, Spin } from 'antd';
import icons from '~/utils/icons';
import moment from 'moment';
import { useAuth } from '~/hooks';
import { path } from '~/utils/constant';
import { useParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { apiGetUserByUsername } from '~/apiServices';

const Profile = () => {
    const { BsFillPostcardFill, LuHash, FaBirthdayCake } = icons;
    const { username } = useParams();
    const { data: { userData: user } = { userData: null }, isLoading } = useQuery({
        queryKey: ['profile', username],
        queryFn: () => apiGetUserByUsername(username),
    });
    const { user: currentUser } = useAuth();
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
                        ) : (
                            <Button primary small className="edit-profile">
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
                                                <Flex gap={10}>
                                                    {post &&
                                                        post?.tags.map((tag) => (
                                                            <TagChildren key={tag._id} tagName={tag.name} color="" />
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
