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

    const likeMutation = useMutation({
        mutationFn: apiLikePost,
        onSuccess: (data) => {
            updatePostInQuery(data.post);
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

    const unLikeMutation = useMutation({
        mutationFn: apiUnlikePost,
        onSuccess: (data) => {
            updatePostInQuery(data.post);
        },
    });

    const bookmarkMutation = useMutation({
        mutationFn: apiBookmarkPost,
        onSuccess: (data) => {
            updatePostInQuery(data.post);
        },
    });

    const unBookmarkMutation = useMutation({
        mutationFn: apiUnbookmarkPost,
        onSuccess: (data) => {
            updatePostInQuery(data.post);
        },
    });

    const handleToggleLike = (postId, isLiked, setIsLiked) => {
        const mutation = isLiked ? unLikeMutation : likeMutation;

        mutation.mutate(postId, {
            onSuccess: () => {
                setIsLiked(!isLiked);
            },
        });
    };

    const handleToggleBookmark = (postId, isBookmarked, setIsBookmarked) => {
        const mutation = isBookmarked ? unBookmarkMutation : bookmarkMutation;

        mutation.mutate(postId, {
            onSuccess: () => {
                setIsBookmarked(!isBookmarked);
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
                                isLiked={post.likes.includes(currentUser?._id)}
                                onToggleLike={handleToggleLike}
                                isBookmarked={post.bookmarks.includes(currentUser?._id)}
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
