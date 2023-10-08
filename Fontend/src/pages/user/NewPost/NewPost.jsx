import React, { useState } from 'react';
import { Button, InputTags, PostMarkdown } from '~/components';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import './NewPost.scss';
import { apiCreatePost } from '~/apiServices/post';
import { toast } from 'react-toastify';

const NewPost = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const [selectedFile, setSelectedFile] = useState(null);
    const [previewImage, setPreviewImage] = useState(null);
    const [body, setBody] = useState('');
    const [title, setTitle] = useState('');
    const [tags, setTags] = useState([]);
    const handleFileChange = (event) => {
        setSelectedFile(event.target.files[0]);
        console.log(event.target.files[0]);
        setPreviewImage(URL.createObjectURL(event.target.files[0]));
    };
    const addTag = (event) => {
        const tag = event.target.value;
        if (event.code === 'Enter' && tag !== '') {
            setTags((tags) => [...tags, tag]);
            event.target.value = '';
        }
        console.log(tags);
    };

    const removeTag = (indexToRemove) => {
        const removedTag = tags[indexToRemove];
        const updatedTags = tags.filter((tag) => tag !== removedTag);
        setTags(updatedTags);
    };

    const handleKeyDown = (event) => {
        if (event.key === 'Enter') {
            event.preventDefault();
        }
    };
    const handleCreatePost = async () => {
        if (selectedFile && body && title && tags.length >= 1) {
            try {
                const formData = new FormData();
                formData.append('image', selectedFile);
                formData.append('body', body);
                formData.append('title', title);
                formData.append('tags', tags);
                //dispatch(startLoading());
                const response = await apiCreatePost(formData);
                if (response.status === 'success') {
                    toast.success('Created successfully');
                } else {
                    toast.error('Create failed');
                }
                //dispatch(finishLoading());

                navigate('/');
            } catch (error) {
                console.log(error);
            }
        } else {
            dispatch(setMessage('This form needs to be filled out'));
            dispatch(setError());
            setTimeout(() => {
                dispatch(resetError());
                setMessage('');
            }, 3000);
        }
    };
    return (
        <div className="new-post">
            <div className="new-post__wrapper">
                <div className="new-post__top">
                    <div>
                        <input type="file" accept="image/*" name="image" id="image-input" onChange={handleFileChange} />
                        {previewImage && (
                            <img
                                src={previewImage}
                                alt="Preview"
                                width={150}
                                height={150}
                                style={{ marginRight: '1rem' }}
                            />
                        )}
                    </div>
                    <textarea
                        className="add-new-title"
                        placeholder="New post title here..."
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                    />
                    <InputTags tags={tags} addTag={addTag} removeTag={removeTag} handleKeyDown={handleKeyDown} />
                </div>
                <div className="new-post__bottom">
                    <div className="new-post__markdown">
                        <PostMarkdown content={body} setContent={setBody} />
                    </div>
                    <Button primary onClick={() => handleCreatePost()}>
                        Post now
                    </Button>
                </div>
            </div>
        </div>
    );
};

export default NewPost;
