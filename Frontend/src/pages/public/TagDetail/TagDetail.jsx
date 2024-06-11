import { Avatar, Flex, Skeleton } from 'antd';
import { UserOutlined } from '@ant-design/icons';
import './TagDetail.scss';
import { Button, PostItem } from '~/components';
import { useInfiniteQuery } from '@tanstack/react-query';
import { useParams } from 'react-router-dom';
import { apiGetPosts } from '~/apiServices';
import InfiniteScroll from 'react-infinite-scroll-component';
import { PulseLoader } from 'react-spinners';
import { path } from '~/utils/constant';

const TagDetail = () => {
   const { id: tagId } = useParams();
   const { data, fetchNextPage, hasNextPage, isLoading } = useInfiniteQuery({
      queryKey: ['tags', tagId],
      queryFn: ({ pageParam = 1 }) =>
         apiGetPosts({ page: pageParam, tag: tagId }, location.pathname),
      refetchOnMount: true,
      staleTime: 0,
      getNextPageParam: (lastPage, allPages) => {
         if (lastPage?.count === 0 || lastPage?.count < 3) return null;
         return allPages.length + 1;
      },
   });
   const _posts = data?.pages.flatMap((page) => page?.posts);

   return (
      <div className="tag-detail">
         <div className="tag-detail__header">
            <h1 className="tag-detail__title">Web Development</h1>
            <p className="tag-detail__subtitle">Because the internet...</p>
         </div>
         <div className="tag-detail__action">
            <Button primary to={`/${path.NEW_POST}`} className="tag-detail__button">
               Create Post
            </Button>
         </div>
         <div className="tag-detail__content">
            <div className="tag-detail__sidebar">
               <div className="tag-detail__sidebar-section">
                  <h2 className="tag-detail__sidebar-title">Submission Guidelines</h2>
                  <ul className="tag-detail__sidebar-list">
                     <li>Be nice.</li>
                     <li>Be respectful.</li>
                     <li>Assume best intentions.</li>
                     <li>Be kind, rewind.</li>
                  </ul>
               </div>
               <div className="tag-detail__sidebar-section">
                  <h2 className="tag-detail__sidebar-title">Tag Moderators</h2>
                  <div className="tag-detail__moderators">
                     <Avatar size="large" icon={<UserOutlined />} />
                     <Avatar size="large" icon={<UserOutlined />} />
                     <Avatar size="large" icon={<UserOutlined />} />
                  </div>
               </div>
            </div>
            <div className="tag-detail__main">
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
                           (post) =>
                              post && (
                                 <PostItem
                                    isShowImage={false}
                                    key={`post_${post._id}`}
                                    postItem={post}
                                 />
                              ),
                        )}
                  </InfiniteScroll>
               )}
            </div>
         </div>
      </div>
   );
};

export default TagDetail;
