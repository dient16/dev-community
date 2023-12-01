import { Avatar, Button, Flex, message } from 'antd';
import './ReadingList.scss';
import { useQuery, useMutation } from '@tanstack/react-query';
import { apiGetBookmarkUser, apiUnbookmarkPost } from '~/apiServices';
import moment from 'moment';

const ReadingList = () => {
    const { data, refetch } = useQuery({
        queryKey: ['ReadingList'],
        queryFn: apiGetBookmarkUser,
    });

    const unBookmarkMutation = useMutation({
        mutationFn: apiUnbookmarkPost,
    });
    return (
        <div className="reading-list">
            <h3 className="reading-list__title">{`Reading List (${data?.posts?.length || 0})`} </h3>
            <div className="reading-list__container">
                {data?.posts &&
                    data.posts.map((post) => {
                        return (
                            <div key={post._id} className="reading-list__item">
                                <Flex align="start" gap={15}>
                                    <Avatar src={post?.author?.avatar} />
                                    <Flex vertical gap={3}>
                                        <div className="reading-list__item-title">{post?.title}</div>
                                        <Flex className="" align="center" gap={10}>
                                            <div className="reading-list__item-author">{`${post?.author.firstname} ${post?.author.lastname}`}</div>
                                            <span>•</span>
                                            <div>{moment(post?.createdAt).fromNow()}</div>
                                            <span>•</span>
                                            <Flex align="center" gap={7}>
                                                {post?.tags &&
                                                    post?.tags.map((tag) => (
                                                        <span key={tag._id}>{`#${tag?.name}`}</span>
                                                    ))}
                                            </Flex>
                                        </Flex>
                                    </Flex>
                                </Flex>
                                <Button
                                    type="primary"
                                    danger
                                    ghost
                                    onClick={() =>
                                        unBookmarkMutation.mutate(post._id, {
                                            onSuccess: (response) => {
                                                if (response.status === 'success') {
                                                    refetch();
                                                    message.success('Deleted bookmark successfully');
                                                } else {
                                                    message.error('Deleted bookmark error');
                                                }
                                            },
                                        })
                                    }
                                >
                                    Delete
                                </Button>
                            </div>
                        );
                    })}
            </div>
        </div>
    );
};

export default ReadingList;
