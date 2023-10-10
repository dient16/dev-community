import React, { useEffect, useState } from 'react';
import './Post.scss';
import icons from '~/utils/icons';
import MDEditor from '@uiw/react-md-editor';
import moment from 'moment';
import { Button } from '~/components';
import { useParams } from 'react-router-dom';
import { apiGetPost } from '~/apiServices/post';

const Post = () => {
    const { FaRegHeart, RiChat1Line, FaRegBookmark } = icons;
    const [post, setPost] = useState(null);
    const { slug: pid } = useParams();
    const getPostDetail = async () => {
        const response = await apiGetPost(pid);
        if (response.status === 'success') {
            setPost(response.data);
        }
    };
    useEffect(() => {
        getPostDetail();
        document.documentElement.setAttribute('data-color-mode', 'dark');
    }, []);
    return (
        <div className="post-detail">
            <div className="post-detail__wrapper">
                <div className="post-detail__actions">
                    <span className="action-like">
                        <FaRegHeart size={28} />
                    </span>
                    <span className="action-comment">
                        <RiChat1Line size={31} />
                    </span>
                    <span className="action-bookmark">
                        <FaRegBookmark size={28} />
                    </span>
                </div>
                <div className="post-detail__body">
                    <img className="post-detail__body-image" src={post?.image} alt="" />
                    <div className="post-detail__body-author">
                        <img className="author-avatar" src={post?.author.avatar} alt="" />
                        <div className="author-wrap">
                            <span className="author-name">{`${post?.author?.firstname} ${post?.author?.lastname}`}</span>
                            <span className="author-post-time">{moment(post?.updatedAt).fromNow()}</span>
                        </div>
                    </div>
                    <h3 className="post-detail__body-title">{post?.title}</h3>
                    <div className="post-detail__body-tags">
                        <span>#web dev</span>
                        <span>#web dev</span>
                    </div>
                    <div className="post-detail__content">
                        <MDEditor.Markdown
                            source={post?.body}
                            //style={{ whiteSpace: 'pre-wrap' }}
                        />
                    </div>
                </div>
                <div className="post-detail__author">
                    <div className="post-detail__author-top">
                        <div className="author-background">
                            <div className="avatar-info">
                                <img className="author-avatar" src={post?.author.avatar} alt="" />
                                <h3>{`${post?.author?.firstname} ${post?.author?.lastname}`}</h3>
                            </div>
                        </div>
                        <Button primary className={'btn-follow'}>
                            Follow
                        </Button>
                        <div className="author-bio">LOCATION Seoul, South Korea PRONOUNS he/him JOINED Jun 6, 2023</div>
                    </div>
                    <div className="author-info"></div>
                </div>
            </div>
        </div>
    );
};

export default Post;
