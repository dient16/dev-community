import React from 'react';
import { Button } from '~/components';
import './Profile.scss';

const Profile = () => {
    return (
        <div className="profile-user">
            <div className="profile-user__background">
                <div className="profile-user__float-container">
                    <div className="profile-user__top">
                        <span className="avatar">
                            <img
                                src="https://vietabinhdinh.edu.vn/wp-content/uploads/Anh-Avatar-Dep-Ngau-Chat-Xi-Khoi-Lam-Hinh-Dai.jpg"
                                alt=""
                            />
                        </span>
                        <Button primary small className="edit-profile">
                            Edit profile
                        </Button>
                        <h2 className="username">Long</h2>
                        <p className="bio">404 bio not found</p>
                        <div className="join-date">Joined on Sep 3, 2023</div>
                    </div>
                    <div className="profile-user__bottom">
                        <div className="slipt-left">
                            <div className="interact">
                                <span className="content">2 posts published</span>
                            </div>
                            <div className="interact">
                                <span className="content">2 posts published</span>
                            </div>
                            <div className="interact">
                                <span className="content">2 posts published</span>
                            </div>
                        </div>
                        <div className="slipt-right">
                            <div className="my-post-item">
                                <div className="author">
                                    <img
                                        className="avatar"
                                        src="https://vietabinhdinh.edu.vn/wp-content/uploads/Anh-Avatar-Dep-Ngau-Chat-Xi-Khoi-Lam-Hinh-Dai.jpg"
                                        alt=""
                                    />
                                    <div>
                                        <div>Long</div>
                                        <div>Sep 1</div>
                                    </div>
                                </div>
                                <h3 className="title">✨ 8 components to become a React master 🧙‍♂️ 🪄</h3>
                                <div className="">
                                    <div className="tags">
                                        <span className="tag">#hsdhh</span>
                                        <span className="tag">#hsdhh</span>
                                    </div>
                                    <div className="read-ago">read 1h</div>
                                </div>
                            </div>
                            <div className="my-post-item">
                                <div className="author">
                                    <img
                                        className="avatar"
                                        src="https://vietabinhdinh.edu.vn/wp-content/uploads/Anh-Avatar-Dep-Ngau-Chat-Xi-Khoi-Lam-Hinh-Dai.jpg"
                                        alt=""
                                    />
                                    <div>
                                        <div>Long</div>
                                        <div>Sep 1</div>
                                    </div>
                                </div>
                                <h3 className="title">✨ 8 components to become a React master 🧙‍♂️ 🪄</h3>
                                <div className="">
                                    <div className="tags">
                                        <span className="tag">#hsdhh</span>
                                        <span className="tag">#hsdhh</span>
                                    </div>
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
