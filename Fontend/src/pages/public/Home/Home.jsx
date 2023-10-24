import React, { useEffect, useState } from 'react';
import './Home.scss';
import { SideBar, PostItem, Loading } from '~/components';
import { useDispatch, useSelector } from 'react-redux';
import { Spin } from 'antd';
import { getPosts } from '~/store/post/actionThunk';

const Home = () => {
    const dispatch = useDispatch();
    const isLoading = useSelector((state) => state.post.isLoading);
    const posts = useSelector((state) => state.post.posts);

    useEffect(() => {
        dispatch(getPosts());
    }, [dispatch]);

    return (
        <div className="home">
            <div className="home__sidebar">
                <div className="sidebar-container">
                    <SideBar />
                </div>
            </div>
            <div className="home__content">
                <Spin indicator={<Loading />} spinning={isLoading} className="loading">
                    {posts &&
                        posts.count > 0 &&
                        posts.posts.map((post) => <PostItem postItemOnHome={post} key={post._id} />)}
                </Spin>
            </div>

            <div className="home__outstanding"></div>
        </div>
    );
};

export default Home;
