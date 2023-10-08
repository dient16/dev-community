import React, { useState } from 'react';
import './Post.scss';
import icons from '~/utils/icons';
import MDEditor from '@uiw/react-md-editor';
import { Button } from '~/components';

const Post = () => {
    const { FaRegHeart, RiChat1Line, FaRegBookmark } = icons;
    const [content, setContent] = useState('');
    //document.documentElement.setAttribute('data-color-mode', 'dark');
    return (
        <div className="post-detail">
            <textarea onChange={(e) => setContent(e.target.value)} />
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
                    <img
                        className="post-detail__body-image"
                        src="https://res.cloudinary.com/practicaldev/image/fetch/s--mB1WYDBO--/c_imagga_scale,f_auto,fl_progressive,h_420,q_auto,w_1000/https://dev-to-uploads.s3.amazonaws.com/uploads/articles/y4n8dnw0gh3vsn76ugh6.png"
                        alt=""
                    />
                    <div className="post-detail__body-author">
                        <img
                            className="author-avatar"
                            src="https://pgddttieucan.edu.vn/wp-content/uploads/2022/09/1663047926_941_Bo-suu-tap-31-anh-anime-avt-moi-cap-nhat.jpeg"
                            alt=""
                        />
                        <div className="author-wrap">
                            <span className="author-name">Dien tc</span>
                            <span className="author-post-time">Posted on Oct 6</span>
                        </div>
                    </div>
                    <h3 className="post-detail__body-title">07 Website's you will love as a dev.</h3>
                    <div className="post-detail__body-tags">
                        <span>#web dev</span>
                        <span>#web dev</span>
                    </div>
                    <div className="post-detail__content">
                        <MDEditor.Markdown source={content} style={{ whiteSpace: 'pre-wrap' }} />
                    </div>
                </div>
                <div className="post-detail__author">
                    <div className="post-detail__author-top">
                        <div className="author-background">
                            <div className="avatar-info">
                                <img
                                    className="author-avatar"
                                    src="https://pgddttieucan.edu.vn/wp-content/uploads/2022/09/1663047926_941_Bo-suu-tap-31-anh-anime-avt-moi-cap-nhat.jpeg"
                                    alt=""
                                />
                                <h3>Dien tc</h3>
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
