import { useState, useEffect } from 'react';
import { InputTags, PostMarkdown, PreviewPost } from '~/components';
import { useMutation } from '@tanstack/react-query'; // Import useMutation
import { useNavigate } from 'react-router-dom';
import { apiCreatePost } from '~/apiServices/post';
import { UploadOutlined } from '@ant-design/icons';
import { Image, Spin, message, Upload, Button, Flex, Tabs } from 'antd';
import './NewPost.scss';
import icons from '~/utils/icons';

const NewPost = () => {
    const navigate = useNavigate();
    const { FiTrash } = icons;
    const [selectedImage, setSelectedImage] = useState(null);
    const [postBody, setPostBody] = useState('');
    const [postTitle, setPostTitle] = useState('');
    const [postTags, setPostTags] = useState([]);
    const createPostMutation = useMutation({
        mutationFn: apiCreatePost,
        onSuccess: () => {
            message.success('Created successfully');
            navigate('/');
        },
        onError: () => {
            message.error('create failed');
        },
    });

    useEffect(() => {
        document.documentElement.setAttribute('data-color-mode', 'light');
    }, []);
    const handleCreatePost = () => {
        if (postBody && postTitle && postTags.length >= 1) {
            const formData = new FormData();
            formData.append('image', selectedImage[0].originFileObj);
            formData.append('body', postBody);
            formData.append('title', postTitle);
            formData.append('tags', postTags);

            createPostMutation.mutate(formData);
        } else {
            message.error('Please fill out all fields');
        }
    };
    const items = [
        {
            key: '1',
            label: <h2>Edit</h2>,
            children: (
                <div>
                    <div className="new-post__add-image">
                        <Upload
                            accept="image/*"
                            listType="picture"
                            customRequest={() => {}}
                            maxCount={1}
                            fileList={selectedImage}
                            onChange={({ fileList }) => {
                                setSelectedImage(fileList);
                            }}
                            itemRender={(originNode, UploadFile, fileList, action) => (
                                <Flex align="center" gap={15} className="preview-upload">
                                    <Image src={UploadFile.thumbUrl} height={80} />
                                    <span>{UploadFile.originFileObj.name}</span>
                                    <span className="delete-upload" onClick={() => action.remove()}>
                                        <FiTrash size={18} />
                                    </span>
                                </Flex>
                            )}
                        >
                            <Button icon={<UploadOutlined />} size="large" className="upload-btn">
                                Add banner image
                            </Button>
                        </Upload>
                    </div>
                    <div className="new-post__top">
                        <textarea
                            className="new-post__title"
                            placeholder="New post title here..."
                            value={postTitle}
                            onChange={(e) => setPostTitle(e.target.value)}
                        />
                        <div className="add-new-tag ">
                            <InputTags value={postTags} onChange={(value) => setPostTags(value)} />
                        </div>
                    </div>
                    <div className="new-post__bottom">
                        <div className="new-post__markdown">
                            <PostMarkdown content={postBody} setContent={setPostBody} />
                        </div>
                        <Button className="new-post__btn-create-post" size="large" onClick={handleCreatePost}>
                            Post now
                        </Button>
                    </div>
                </div>
            ),
        },
        {
            key: '2',
            label: <h2>Preview</h2>,
            children: (
                <PreviewPost
                    body={postBody}
                    title={postTitle}
                    tags={postTags}
                    image={selectedImage?.[0]?.originFileObj}
                />
            ),
        },
    ];

    return (
        <>
            <Spin size="large" spinning={createPostMutation.isPending} fullscreen={createPostMutation.isPending}></Spin>
            <div className="new-post">
                <div className="new-post__wrapper">
                    <Tabs defaultActiveKey="1" items={items} />
                </div>
            </div>
        </>
    );
};

export default NewPost;
