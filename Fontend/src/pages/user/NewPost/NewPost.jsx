import React, { useState, useEffect } from 'react';
import { Button, InputTags, PostMarkdown } from '~/components';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { apiCreatePost } from '~/apiServices/post';
import { LoadingApp } from '~/store/app/appSlice';
import { toast } from 'react-toastify';
import './NewPost.scss';

const NewPost = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const [selectedImage, setSelectedImage] = useState(null);
    const [previewImage, setPreviewImage] = useState(null);
    const [postBody, setPostBody] = useState('');
    const [postTitle, setPostTitle] = useState('');
    const [postTags, setPostTags] = useState([]);
    useEffect(() => {
        document.documentElement.setAttribute('data-color-mode', 'light');
    }, []);
    const handleImageChange = (event) => {
        setSelectedImage(event.target.files[0]);
        setPreviewImage(URL.createObjectURL(event.target.files[0]));
    };
    const addTag = (event) => {
        const tag = event.target.value;
        if ((event.code === 'Enter' || event.code === 'Space') && tag.trim() !== '') {
            setPostTags((tags) => [...tags, tag.trim()]);
            event.target.value = '';
        }
    };

    const removeTag = (indexToRemove) => {
        setPostTags((tags) => tags.filter((_, index) => index !== indexToRemove));
    };

    const handleKeyDown = (event) => {
        if (event.key === 'Enter') {
            event.preventDefault();
        }
    };

    const handleCreatePost = async () => {
        if (postBody && postTitle && postTags.length >= 1) {
            try {
                const formData = new FormData();
                formData.append('image', selectedImage);
                formData.append('body', postBody);
                formData.append('title', postTitle);
                formData.append('tags', postTags);
                dispatch(LoadingApp({ isLoading: true }));
                const response = await apiCreatePost(formData);
                if (response.status === 'success') {
                    toast.success('Created successfully');
                    navigate('/');
                } else {
                    toast.error('Create failed');
                }
            } catch (error) {
                console.error(error);
            } finally {
                dispatch(LoadingApp({ isLoading: false }));
            }
        } else {
            toast.error('Please fill out all fields');
        }
    };

    return (
        <div className="new-post">
            <div className="new-post__wrapper">
                <div className="new-post__add-image">
                    <label htmlFor="image-input" className="new-post__custom-input">
                        Add banner image
                    </label>
                    <input
                        type="file"
                        accept="image/*"
                        id="image-input"
                        onChange={handleImageChange}
                        className="new-post__input-file"
                    />
                    {previewImage && (
                        <img
                            src={previewImage}
                            alt="Preview"
                            width={150}
                            height={150}
                            className="new-post__preview-image"
                        />
                    )}
                </div>
                <div className="new-post__top">
                    <textarea
                        className="new-post__title"
                        placeholder="New post title here..."
                        value={postTitle}
                        onChange={(e) => setPostTitle(e.target.value)}
                    />
                    <div className="add-new-tag ">
                        <InputTags
                            tags={postTags}
                            addTag={addTag}
                            removeTag={removeTag}
                            handleKeyDown={handleKeyDown}
                        />
                    </div>
                </div>
                <div className="new-post__bottom">
                    <div className="new-post__markdown">
                        <PostMarkdown content={postBody} setContent={setPostBody} />
                    </div>
                    <Button primary onClick={handleCreatePost}>
                        Post now
                    </Button>
                </div>
            </div>
        </div>
    );
};

export default NewPost;
