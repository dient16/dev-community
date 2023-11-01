import React from 'react';
import { Button } from '~/components';
import './Profile.scss';
import { Avatar, Flex } from 'antd';
import icons from '~/utils/icons';

const Profile = () => {
    const { BsFillPostcardFill, LuHash, FaBirthdayCake } = icons;
    return (
        <div className="profile-user">
            <div className="profile-user__background">
                <div className="profile-user__float-container">
                    <div className="profile-user__top">
                        <span className="avatar">
                            <Avatar
                                src="https://vietabinhdinh.edu.vn/wp-content/uploads/Anh-Avatar-Dep-Ngau-Chat-Xi-Khoi-Lam-Hinh-Dai.jpg"
                                size={150}
                            />
                        </span>
                        <Button primary small className="edit-profile">
                            Edit profile
                        </Button>
                        <h2 className="username">Long</h2>
                        <p className="bio">404 bio not found</p>
                        <Flex align="center" gap={10}>
                            <FaBirthdayCake size={20} />
                            <span className="join-date">Joined on Sep 3, 2023</span>
                        </Flex>
                    </div>
                    <div className="profile-user__bottom">
                        <div className="slipt-left">
                            <Flex align="center" gap={15}>
                                <BsFillPostcardFill size={20} />
                                <span className="content">2 posts published</span>
                            </Flex>
                            <Flex align="center" gap={10}>
                                <LuHash size={20} />
                                <span className="content">15 tags followed</span>
                            </Flex>
                        </div>
                        <div className="slipt-right">
                            <div className="my-post-item">
                                <div className="author">
                                    <Avatar
                                        src="https://vietabinhdinh.edu.vn/wp-content/uploads/Anh-Avatar-Dep-Ngau-Chat-Xi-Khoi-Lam-Hinh-Dai.jpg"
                                        size={45}
                                    />
                                    <Flex vertical>
                                        <span>Long</span>
                                        <span>Sep 1</span>
                                    </Flex>
                                </div>
                                <h3 className="title">✨ 8 components to become a React master 🧙‍♂️ 🪄</h3>
                                <div className="">
                                    <Flex gap={10}>
                                        <span className="tag">#hsdhh</span>
                                        <span className="tag">#hsdhh</span>
                                    </Flex>
                                    <div className="read-ago">read 1h</div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Profile;
