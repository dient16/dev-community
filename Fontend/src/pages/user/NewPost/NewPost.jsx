import React, { useState } from 'react';
import { Button, PostMarkdown } from '~/components';
import './NewPost.scss';

const NewPost = () => {
    const [content, setContent] = useState('');
    return (
        <div className="new-post">
            <div className="new-post__wrapper">
                <div className="new-post__top">
                    <div>
                        <Button outline small>
                            Add banner image
                        </Button>
                    </div>
                    <textarea className="add-new-title" placeholder="New post title here..." />
                    <input className="add-new-tag" placeholder="add to tag" />
                </div>
                <div className="new-post__bottom">
                    <div className="new-post__markdown">
                        <PostMarkdown content={content} setContent={setContent} />
                    </div>
                    <Button primary>Post now</Button>
                </div>
            </div>
        </div>
    );
};

export default NewPost;
