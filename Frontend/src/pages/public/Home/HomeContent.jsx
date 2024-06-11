import './Home.scss';
import { PostItem } from '~/components';
import { useInfiniteQuery } from '@tanstack/react-query';
import { Flex, Skeleton } from 'antd';
import InfiniteScroll from 'react-infinite-scroll-component';
import { apiGetPosts } from '~/apiServices';
import { useEffect } from 'react';
import { PulseLoader } from 'react-spinners';
import { useLocation } from 'react-router-dom';

const HomeContent = () => {
   const location = useLocation();
   const { data, fetchNextPage, hasNextPage, isLoading, refetch } = useInfiniteQuery({
      queryKey: ['post-home', location.pathname],
      queryFn: ({ pageParam = 1 }) => apiGetPosts({ page: pageParam }, location.pathname),
      refetchOnMount: true,
      staleTime: 0,
      getNextPageParam: (lastPage, allPages) => {
         if (lastPage?.count === 0 || lastPage?.count < 3) return null;
         return allPages.length + 1;
      },
   });
   useEffect(() => {
      refetch();
   }, [location.pathname, refetch]);

   const _posts = data?.pages.flatMap((page) => page?.posts);

   return (
      <div className="home-container">
         {isLoading ? (
            <Flex vertical gap={30}>
               <Skeleton avatar paragraph={{ rows: 5 }} active />
               <Skeleton avatar paragraph={{ rows: 5 }} active />
               <Skeleton avatar paragraph={{ rows: 5 }} active />
            </Flex>
         ) : (
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
                     (post, index) =>
                        post && (
                           <PostItem
                              isShowImage={index === 0}
                              key={`post_${post._id}`}
                              postItem={post}
                           />
                        ),
                  )}
            </InfiniteScroll>
         )}
      </div>
   );
};

export default HomeContent;
