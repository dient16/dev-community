import React from 'react';
import './Post.scss';
import icons from '~/utils/icons';

const Post = () => {
    const { FaRegHeart, RiChat1Line, FaRegBookmark } = icons;
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
                    <div className="post-content">
                        In this article In this article Introduction What is a Micro Frontend? Module Federation Why
                        Vite? Creating a Micro Frontend using Vite + React Setting Up the Host App Setting Up the Remote
                        App Creating Components in the Remote App Previewing the Remote App Adding Module Federation to
                        the Remote App Serving the Remote App Adding Module Federation to the Host App Using Remote
                        Components in the Host App Serving the Host App Conclusion Introduction Micro Frontends:
                        Enhancing Web Development with Vite and Module Federation In this article, we'll explore the
                        concept of Micro Frontends—a powerful architectural approach for web applications. Micro
                        Frontends allow you to divide your front-end code into smaller, independently developed and
                        deployable units. These units, known as micro frontends, offer numerous benefits, including
                        increased development speed, scalability, and flexibility. By enabling different teams to work
                        on separate parts of the front end while maintaining integration through an isolation layer,
                        Micro Frontends help manage complexity and promote autonomy in front-end development. What is a
                        Micro Frontend? A Micro Frontend is an architectural approach for web applications where the
                        front-end code is divided into smaller, independently developed and deployable units called
                        micro frontends. This approach enhances development speed, scalability, and flexibility by
                        allowing different teams to work on separate parts of the front end while maintaining
                        integration through an isolation layer. It's a way to manage complexity and promote autonomy in
                        front-end development. Module Federation Module Federation is a key technology that enables a
                        JavaScript application to load code dynamically from another application while sharing
                        dependencies. When an application consuming a federated module lacks a required dependency,
                        Webpack (the underlying technology) automatically fetches the missing dependency from the
                        federated build source. This allows for efficient sharing and use of common libraries across
                        multiple micro frontends. Why Vite? While Module Federation was initially introduced in Webpack,
                        the landscape of JavaScript development has evolved. Vite has emerged as a game-changer by
                        providing lightning-fast build times. Combining Vite and Module Federation can unlock immense
                        capabilities for developing micro frontends quickly and efficiently. Creating a Micro Frontend
                        using Vite + React Creating a micro frontend typically involves two main parts: Host
                        Application: This is the primary application that users interact with. It serves as the
                        container for the micro frontends. Remote Application: These are the micro frontends themselves,
                        which act as building blocks for the host application. Now that we have an understanding of the
                        technologies we'll be using, let's dive into the practical implementation. Setting Up the Host
                        App To create a host application using Vite and React, run the following command:
                    </div>
                </div>
                <div className="post-detail__author">
                    <div className="author-top"></div>
                    <div className="author-info"></div>
                </div>
            </div>
        </div>
    );
};

export default Post;
