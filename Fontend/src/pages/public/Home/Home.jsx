import React, { useEffect, useState } from 'react';
import './Home.scss';
import { SideBar, PostItem } from '~/components';
import { apiGetPosts } from '~/apiServices/post';
import Loading from '~/components/Loading/Loading';
const Home = () => {
    const [posts, setPosts] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const getPostsOnHome = async () => {
        setIsLoading(true);
        const response = await apiGetPosts();
        if (response?.status === 'success') {
            setPosts(response);
            setIsLoading(false);
        } else setIsLoading(false);
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
            {isLoading ? (
                <Loading />
            ) : (
                <div className="home__content">
                    {posts.count > 0 && posts.posts.map((post) => <PostItem postItemOnHome={post} key={post._id} />)}
                </div>
            )}
            <div className="home__outstanding"></div>
        </div>
    );
};

export default Home;
