import { useEffect } from 'react';
import { InputTags, PostMarkdown } from '~/components';
import { useMutation } from '@tanstack/react-query';
import { useNavigate, useParams } from 'react-router-dom';
import { apiEditPost, apiGetPost } from '~/apiServices/post';
import { UploadOutlined } from '@ant-design/icons';
import { Image, Spin, message, Upload, Button, Flex } from 'antd';
import './EditPost.scss';
import icons from '~/utils/icons';
import { Controller, useForm } from 'react-hook-form';

const EditPost = () => {
    const navigate = useNavigate();
    const { slug } = useParams();
    const { FiTrash } = icons;

    const {
        handleSubmit,
        control,
        formState: { errors, isLoading },
        getValues,
    } = useForm({
        defaultValues: async () => {
            const response = await apiGetPost(slug);
            if (response.status === 'success') {
                const { _id, title, body, image: imageOld } = response.data;
                const tags = response.data.tags.map((tag) => tag.name);
                return { _id, title, body, tags, imageOld, image: [] };
            } else return { title: '', body: '', tags: '', image: [] };
        },
    });
    const editPostMutation = useMutation({
        mutationFn: apiEditPost,
    });

    useEffect(() => {
        document.documentElement.setAttribute('data-color-mode', 'light');
    }, []);

    const handleEditPost = (data) => {
        const formData = new FormData();
        if (data.image.length > 0) {
            formData.append('image', data.image[0].originFileObj);
        }
        formData.append('body', data.body);
        formData.append('title', data.title);
        formData.append('tags', data.tags);
        editPostMutation.mutate(
            { postId: getValues('_id'), data: formData },
            {
                onSuccess: (data) => {
                    if (data.status === 'success') {
                        message.success('Edit post successfully');
                        navigate(-1);
                    } else {
                        message.error('Edit post failed');
                    }
                },
            },
        );
    };

    return (
        <>
            <Spin
                size="large"
                spinning={editPostMutation.isPending || isLoading}
                fullscreen={editPostMutation.isPending}
            ></Spin>
            <form onSubmit={handleSubmit(handleEditPost)}>
                <div className="new-post">
                    <div className="new-post__wrapper">
                        <div className="new-post__add-image">
                            <Controller
                                control={control}
                                name="image"
                                render={({ field: { onChange, value } }) => (
                                    <Flex vertical gap={5}>
                                        <Flex align="center" gap={10}>
                                            <Upload
                                                accept="image/*"
                                                listType="picture"
                                                customRequest={() => {}}
                                                maxCount={1}
                                                fileList={value}
                                                onChange={({ fileList }) => {
                                                    onChange(fileList);
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
                                            {!(getValues('image')?.length > 0) && (
                                                <Image src={getValues('imageOld')} height={70} />
                                            )}
                                        </Flex>
                                        {errors?.image && (
                                            <span className="error-message">{errors?.image.message}</span>
                                        )}
                                    </Flex>
                                )}
                            />
                        </div>
                        <div className="new-post__top">
                            <Controller
                                control={control}
                                name="title"
                                rules={{
                                    required: 'Title is required',
                                }}
                                render={({ field }) => (
                                    <Flex vertical gap={5}>
                                        <textarea
                                            className="new-post__title"
                                            placeholder="New post title here..."
                                            {...field}
                                        />
                                        {errors?.title && (
                                            <span className="error-message">{errors?.title.message}</span>
                                        )}
                                    </Flex>
                                )}
                            />
                            <div className="add-new-tag ">
                                <Controller
                                    control={control}
                                    name="tags"
                                    rules={{
                                        required: 'Tags is required',
                                    }}
                                    render={({ field: { value, onChange } }) => (
                                        <Flex vertical gap={5}>
                                            <InputTags
                                                value={value}
                                                onChange={(value) => {
                                                    onChange(value);
                                                }}
                                            />
                                            {errors?.tags && (
                                                <span className="error-message">{errors?.tags.message}</span>
                                            )}
                                        </Flex>
                                    )}
                                />
                            </div>
                        </div>
                        <div className="new-post__bottom">
                            <div className="new-post__markdown">
                                <Controller
                                    control={control}
                                    name="body"
                                    rules={{
                                        required: 'Body is required',
                                    }}
                                    render={({ field: { onChange, value } }) => (
                                        <Flex vertical gap={5}>
                                            <PostMarkdown content={value} setContent={(value) => onChange(value)} />
                                            {errors?.body && (
                                                <span className="error-message">{errors?.body.message}</span>
                                            )}
                                        </Flex>
                                    )}
                                />
                            </div>
                            <Button className="new-post__btn-edit-post" type="primary" size="large" htmlType="submit">
                                Save change
                            </Button>
                        </div>
                    </div>
                </div>
            </form>
        </>
    );
};

export default EditPost;
