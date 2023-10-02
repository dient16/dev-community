import React from 'react';
import './PostItem.scss';
const PostItem = () => {
    return (
        <div className="post-item">
            <img
                className="post-item__image"
                src="https://res.cloudinary.com/practicaldev/image/fetch/s--RmY6Zrlb--/c_imagga_scale,f_auto,fl_progressive,h_420,q_auto,w_1000/https://dev-to-uploads.s3.amazonaws.com/uploads/articles/hpa62sv1woh39hd65bcs.jpg"
                alt=""
            />
            <div className="post-item__body">
                <div className="post-item__author">
                    <img
                        src="https://res.cloudinary.com/practicaldev/image/fetch/s--d7-icDZB--/c_fill,f_auto,fl_progressive,h_90,q_auto,w_90/https://dev-to-uploads.s3.amazonaws.com/uploads/user/profile_image/1168717/1fe46d48-beee-4dfc-ae8a-697de0470ef0.jpg"
                        alt=""
                    />
                    <div className="author-title">
                        <span className="auhtor-name">Dien t</span>
                        <span className="author-created-at">Oct 1 (21 hours ago)</span>
                    </div>
                    <div className="post-item__tags">
                        <span>#nextjs</span>
                    </div>
                </div>
                <div className="post-item__acitons">
                    <span className="post-item__like"></span>
                    <div className=""></div>
                    <span className="post-item__bookmak"></span>
                </div>
            </div>
        </div>
    );
};

export default PostItem;
