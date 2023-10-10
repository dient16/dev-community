import React, { useEffect, useState } from 'react';
import './Home.scss';
import { SideBar, PostItem } from '~/components';
import { apiGetPosts } from '~/apiServices/post';
const Home = () => {
    const [posts, setPosts] = useState([]);
    const getPostsOnHome = async () => {
        const response = await apiGetPosts();
        if (response.status === 'success') {
            setPosts(response);
        }
    };
    useEffect(() => {
        getPostsOnHome();
    }, []);
    return (
        <div className="home">
            <div className="home__sidebar">
                <div className="sidebar-container">
                    <SideBar />
                </div>
            </div>
            <div className="home__content">
                {posts.count > 0 && posts.posts.map((post) => <PostItem postItemOnHome={post} key={post._id} />)}
            </div>
            <div className="home__outstanding"></div>
        </div>
    );
};

export default Home;
