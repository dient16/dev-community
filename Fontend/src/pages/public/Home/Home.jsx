import './Home.scss';
import { SideBar, PostItem, Loading } from '~/components';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Spin } from 'antd';
import { apiGetPosts, apiLikePost, apiUnlikePost } from '~/apiServices';
import { useAuth } from '~/hooks';

const Home = () => {
    const { user: currentUser } = useAuth();
    const queryClient = useQueryClient();

    const { data: posts, isLoading } = useQuery({
        queryKey: ['posts'],
        queryFn: apiGetPosts,
    });

    const likeMutation = useMutation({
        mutationFn: apiLikePost,
        onSuccess: (data) => {
            const updatedPost = data.post;
            queryClient.setQueryData(['posts'], (prevData) => {
                return {
                    ...prevData,
                    posts: prevData.posts.map((post) => (post._id === updatedPost._id ? updatedPost : post)),
                };
            });
        },
    });

    const unLikeMutation = useMutation({
        mutationFn: apiUnlikePost,
        onSuccess: (data) => {
            const updatedPost = data.post;
            queryClient.setQueryData(['posts'], (prevData) => {
                return {
                    ...prevData,
                    posts: prevData.posts.map((post) => (post._id === updatedPost._id ? updatedPost : post)),
                };
            });
        },
    });

    const handleToggleLike = (postId, isLiked, setIsLiked) => {
        if (isLiked) {
            likeMutation.mutate(postId, {
                onSuccess: () => {
                    setIsLiked(true);
                },
            });
        } else {
            unLikeMutation.mutate(postId, {
                onSuccess: () => {
                    setIsLiked(false);
                },
            });
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
                <Spin indicator={<Loading />} spinning={isLoading} fullscreen={isLoading}>
                    <div className="home__navigation">
                        <span>For you</span>
                        <span>Top</span>
                        <span>Latest</span>
                    </div>
                    {posts &&
                        posts.count > 0 &&
                        posts.posts.map((post) => (
                            <PostItem
                                key={post._id}
                                postItemOnHome={post}
                                isLiked={post.likes.includes(currentUser?._id)}
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
