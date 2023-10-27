import React from 'react';
import './Home.scss';
import { SideBar, PostItem, Loading } from '~/components';
import { useQuery } from '@tanstack/react-query';
import { Spin } from 'antd';
import { apiGetPosts } from '~/apiServices';

const Home = () => {
    const { data: posts, isLoading } = useQuery({ queryKey: ['posts'], queryFn: apiGetPosts });
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
