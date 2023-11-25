import './Home.scss';
import { PostItem } from '~/components';
import { useQueryClient, useInfiniteQuery } from '@tanstack/react-query';
import { Flex, FloatButton, Skeleton } from 'antd';
import InfiniteScroll from 'react-infinite-scroll-component';
import { apiGetPosts, apiLikePost, apiUnlikePost, apiBookmarkPost, apiUnbookmarkPost } from '~/apiServices';
import { useAuth } from '~/hooks';
import { SocketContext } from '~/contexts/socketContext';
import { useContext, useEffect } from 'react';
import { PulseLoader } from 'react-spinners';
import { useLocation } from 'react-router-dom';

const HomeContent = () => {
    const { user: currentUser } = useAuth();
    const queryClient = useQueryClient();
    const socket = useContext(SocketContext);
    const location = useLocation();
    const { data, fetchNextPage, hasNextPage, isLoading, refetch } = useInfiniteQuery({
        queryKey:
            location.pathname === '/'
                ? ['posts', 'for-you']
                : location.pathname === '/top'
                ? ['posts', 'for-you']
                : ['posts', 'latest'],
        queryFn: ({ pageParam = 1 }) => apiGetPosts(pageParam, location.pathname),
        refetchOnMount: true,
        getNextPageParam: (lastPage, allPages) => {
            if (lastPage?.count === 0 || lastPage?.count < 3) return null;
            return allPages.length + 1;
        },
    });
    useEffect(() => {
        refetch();
    }, [location.pathname, refetch]);
    const handleToggleLike = (postId, isLiked) => {
        const apiAction = isLiked ? apiUnlikePost : apiLikePost;

        apiAction(postId).then((data) => {
            updatePostInQuery(data.post);
            if (!isLiked && currentUser._id !== data.post.author._id) {
                socket.emit('like', {
                    sender: {
                        id: currentUser?._id,
                        username: currentUser?.username,
                        avatar: currentUser?.avatar,
                    },
                    receiver: {
                        id: data?.post?.author?._id,
                        username: data?.post?.author?.username,
                        avatar: data?.post?.author?.avatar,
                    },
                    postId: data?.post?._id,
                    date: Date.now(),
                });
            }
        });
    };

    const handleToggleBookmark = (postId, isBookmarked) => {
        const apiAction = isBookmarked ? apiUnbookmarkPost : apiBookmarkPost;

        apiAction(postId).then((data) => {
            queryClient.invalidateQueries({
                queryKey: ['currentUser'],
            });
            updatePostInQuery(data.post);
        });
    };

    const updatePostInQuery = (updatedPost) => {
        queryClient.setQueryData(
            location.pathname === '/'
                ? ['posts', 'for-you']
                : location.pathname === '/top'
                ? ['posts', 'for-you']
                : ['posts', 'latest'],
            (prevData) => {
                const newPosts = prevData.pages.map((page) => ({
                    ...page,
                    posts: page.posts.map((post) => (post._id === updatedPost._id ? updatedPost : post)),
                }));

                return {
                    ...prevData,
                    pages: newPosts,
                };
            },
        );
    };
    const _posts = data?.pages.flatMap((page) => page?.posts);

    return (
        <div>
            {isLoading ? (
                <Flex vertical gap={30}>
                    <Skeleton avatar paragraph={{ rows: 5 }} active />
                    <Skeleton avatar paragraph={{ rows: 5 }} active />
                    <Skeleton avatar paragraph={{ rows: 5 }} active />
                </Flex>
            ) : (
                <>
                    <InfiniteScroll
                        dataLength={_posts?.length}
                        next={() => fetchNextPage()}
                        hasMore={hasNextPage}
                        loader={
                            <Flex align="center" justify="center">
                                <PulseLoader />
                            </Flex>
                        }
                    >
                        {_posts?.length > 0 &&
                            _posts.map(
                                (post) =>
                                    post && (
                                        <PostItem
                                            key={`post_${post._id}`}
                                            postItemOnHome={post}
                                            isLiked={post?.isLiked || false}
                                            onToggleLike={() => handleToggleLike(post._id, post?.isLiked)}
                                            isBookmarked={post?.isBookmarked || false}
                                            onToggleBookmark={() => handleToggleBookmark(post._id, post?.isBookmarked)}
                                        />
                                    ),
                            )}
                    </InfiniteScroll>
                </>
            )}
            {/* <FloatButton.BackTop /> */}
        </div>
    );
};

export default HomeContent;
