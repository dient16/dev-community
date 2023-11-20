import './Home.scss';
import { SideBar, PostItem, Loading, Discuss } from '~/components';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Spin } from 'antd';
import { apiGetPosts, apiLikePost, apiUnlikePost, apiBookmarkPost, apiUnbookmarkPost } from '~/apiServices';
import { useAuth } from '~/hooks';
import { SocketContext } from '~/contexts/socketContext';
import { useContext } from 'react';

const Home = () => {
    const { user: currentUser } = useAuth();
    const queryClient = useQueryClient();
    const socket = useContext(SocketContext);
    const { data: posts, isLoading } = useQuery({
        queryKey: ['posts'],
        queryFn: apiGetPosts,
    });
    const unLikeMutation = useMutation({
        mutationFn: apiUnlikePost,
    });

    const bookmarkMutation = useMutation({
        mutationFn: apiBookmarkPost,
    });

    const unBookmarkMutation = useMutation({
        mutationFn: apiUnbookmarkPost,
    });

    const likeMutation = useMutation({
        mutationFn: apiLikePost,
        onSuccess: (data) => {
            if (currentUser._id !== data.post.author._id) {
                socket.emit('like', {
                    sender: { id: currentUser?._id, username: currentUser?.username, avatar: currentUser?.avatar },
                    receiver: {
                        id: data?.post?.author?._id,
                        username: data?.post?.author?.username,
                        avatar: data?.post?.author?.avatar,
                    },
                    postId: data?.post?._id,
                    date: Date.now(),
                });
            }
        },
    });

    const handleToggleLike = (postId, isLiked) => {
        const mutation = isLiked ? unLikeMutation : likeMutation;
        mutation.mutate(postId, {
            onSuccess: (data) => {
                updatePostInQuery(data.post);
            },
        });
    };

    const handleToggleBookmark = (postId, isBookmarked) => {
        const mutation = isBookmarked ? unBookmarkMutation : bookmarkMutation;

        mutation.mutate(postId, {
            onSuccess: (data) => {
                updatePostInQuery(data.post);
            },
        });
    };

    const updatePostInQuery = (updatedPost) => {
        queryClient.setQueryData(['posts'], (prevData) => {
            return {
                ...prevData,
                posts: prevData.posts.map((post) => (post._id === updatedPost._id ? updatedPost : post)),
            };
        });
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
                                isLiked={post?.isLiked || false}
                                onToggleLike={handleToggleLike}
                                isBookmarked={post?.isBookmarked || false}
                                onToggleBookmark={handleToggleBookmark}
                            />
                        ))}
                </Spin>
            </div>
            <div className="home__outstanding">
                <Discuss />
            </div>
        </div>
    );
};

export default Home;
