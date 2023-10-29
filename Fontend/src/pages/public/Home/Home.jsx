import React, { useState } from 'react';
import './Home.scss';
import { SideBar, PostItem, Loading } from '~/components';
import { useQuery, useMutation } from '@tanstack/react-query';
import { Spin } from 'antd';
import { apiGetPosts, apiLikePost, apiUnlikePost } from '~/apiServices';
import { getFromLocalStorage } from '~/utils/helper';

const Home = () => {
    const [posts, setPosts] = useState(null);
    const { currentUser } = getFromLocalStorage('dev-community');
    const { data: fetchedPosts, isLoading } = useQuery({ queryKey: ['posts'], queryFn: apiGetPosts });
    const likeMutation = useMutation({
        mutationFn: apiLikePost,
    });
    const unLikeMutation = useMutation({
        mutationFn: apiUnlikePost,
    });
    if (fetchedPosts && !posts) {
        setPosts(fetchedPosts);
    }

    const handleToggleLike = (postId, isLiked, setIsLiked) => {
        if (isLiked) {
            likeMutation.mutate(postId, {
                onSuccess: (response) => {
                    setIsLiked(true);
                    updatePostItemOnHome(postId, response.post);
                },
            });
        } else {
            unLikeMutation.mutate(postId, {
                onSuccess: (response) => {
                    setIsLiked(false);
                    updatePostItemOnHome(postId, response.post);
                },
            });
        }
    };

    const updatePostItemOnHome = (postId, updatedPost) => {
        if (posts) {
            const postIndex = posts.posts.findIndex((post) => post._id === postId);

            if (postIndex !== -1) {
                const updatedPosts = [...posts.posts];
                updatedPosts[postIndex] = updatedPost;
                setPosts({ ...posts, posts: updatedPosts });
            }
        }
    };
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
                        posts.posts.map((post) => (
                            <PostItem
                                key={post._id}
                                postItemOnHome={post}
                                isLiked={post.likes.includes(currentUser._id)}
                                onToggleLike={handleToggleLike}
                            />
                        ))}
                </Spin>
            </div>
            <div className="home__outstanding"></div>
        </div>
    );
};

export default Home;
